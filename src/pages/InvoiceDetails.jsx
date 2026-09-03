import { useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/Mainlayout";
import {
  getInvoices,
  updateInvoice,
  deleteInvoice,
} from "../services/invoiceService";
import { createPaymentReceipt } from "../services/paymentReceipt";
import {
  deleteReceiptForPayment,
  updateReceiptForPayment,
} from "../services/receiptService";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastContext";
import { formatCurrency } from "../utils/currency";
import {
  getInvoiceAmountPaid,
  getInvoiceBalance,
  getInvoicePayments,
  getInvoicePaymentStatus,
  recalculateInvoicePaymentState,
  validateInvoicePayment,
  applyPaidInventoryTransition,
} from "../utils/invoicePayments";
import {
  createFinancialId,
  hasRelationshipId,
  relationshipIdsEqual,
  resolveFinancialRoute,
} from "../utils/financialIdentity";

const safeDocumentAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { deductInventoryFromInvoice, setInvoices } = useApp();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const paymentSubmissionInProgress = useRef(false);

  const invoices = getInvoices();

  const invoice = resolveFinancialRoute(invoices, id);

  const currentAmountPaid = getInvoiceAmountPaid(invoice);
  const remainingBalance = getInvoiceBalance(invoice);
  const invoicePayments = getInvoicePayments(invoice).filter(Boolean);
  const invoiceStatus = getInvoicePaymentStatus(invoice);

  const company =
    JSON.parse(localStorage.getItem("company")) || {};

  const [payment, setPayment] = useState({
    amount: "",
    method: "Cash",
    reference: "",
    date: new Date().toISOString().split("T")[0],
  });

  function savePayment() {
    if (paymentSubmissionInProgress.current) return;
    const validation = validateInvoicePayment({ invoice, value: payment.amount, date: payment.date });
    if (!validation.valid) {
      showToast({ type: "error", title: "Payment rejected", message: validation.maximumAmount !== undefined
        ? `The maximum payment allowed is ${formatCurrency(validation.maximumAmount)}.`
        : validation.message });
      return;
    }

    paymentSubmissionInProgress.current = true;
    setIsSavingPayment(true);

    const newPayment = {
      id: createFinancialId("payment"),
      amount: validation.amount,
      method: payment.method,
      reference: payment.reference,
      date: payment.date,
    };

    let updatedInvoice = recalculateInvoicePaymentState({
      ...invoice,
      paymentHistoryVersion: 1,
      payments: [
        ...invoicePayments,
        newPayment,
      ],
    });
    updatedInvoice = applyPaidInventoryTransition(
      updatedInvoice,
      deductInventoryFromInvoice,
    ).invoice;

    try {
      updateInvoice(updatedInvoice);
      setInvoices((currentInvoices) => currentInvoices.map((currentInvoice) =>
        relationshipIdsEqual(currentInvoice.id, updatedInvoice.id) ? updatedInvoice : currentInvoice
      ));
      createPaymentReceipt(updatedInvoice, newPayment);
      setPayment({ amount: "", method: "Cash", reference: "", date: new Date().toISOString().split("T")[0] });
      showToast({ type: "success", title: "Payment recorded", message: "Payment recorded successfully" });
    } finally {
      paymentSubmissionInProgress.current = false;
      setIsSavingPayment(false);
    }
  }

  function startEditingPayment(recordedPayment) {
    setEditingPayment({
      ...recordedPayment,
      amount: String(recordedPayment.amount ?? ""),
      method: recordedPayment.method || "Cash",
      reference: recordedPayment.reference || "",
      date: recordedPayment.date || new Date().toISOString().split("T")[0],
    });
  }

  function saveEditedPayment() {
    const validation = validateInvoicePayment({
      invoice,
      value: editingPayment?.amount,
      date: editingPayment?.date,
      editingPaymentId: editingPayment?.id,
    });
    if (!validation.valid) {
      showToast({
        type: "error",
        title: "Payment rejected",
        message: validation.maximumAmount !== undefined
          ? `The maximum amount allowed for this payment is ${formatCurrency(validation.maximumAmount)}.`
          : validation.message,
      });
      return;
    }

    let updatedInvoice = recalculateInvoicePaymentState({
      ...invoice,
      paymentHistoryVersion: 1,
      payments: invoicePayments.map((recordedPayment) =>
        relationshipIdsEqual(recordedPayment.id, editingPayment.id)
          ? {
              ...recordedPayment,
              amount: validation.amount,
              method: editingPayment.method,
              reference: editingPayment.reference,
              date: editingPayment.date,
            }
          : recordedPayment
      ),
    });

    updatedInvoice = applyPaidInventoryTransition(
      updatedInvoice,
      deductInventoryFromInvoice,
    ).invoice;

    updateInvoice(updatedInvoice);
    const savedPayment = updatedInvoice.payments.find(
      (recordedPayment) => relationshipIdsEqual(recordedPayment.id, editingPayment.id)
    );
    updateReceiptForPayment(updatedInvoice.id, savedPayment);
    setInvoices((currentInvoices) => currentInvoices.map((currentInvoice) =>
      relationshipIdsEqual(currentInvoice.id, updatedInvoice.id) ? updatedInvoice : currentInvoice
    ));
    setEditingPayment(null);
    showToast({
      type: "success",
      title: "Payment updated",
      message: "Payment updated successfully",
    });
  }

  function deletePayment() {
    if (!paymentToDelete) return;

    const updatedInvoice = recalculateInvoicePaymentState({
      ...invoice,
      paymentHistoryVersion: 1,
      payments: invoicePayments.filter(
        (recordedPayment) => !relationshipIdsEqual(recordedPayment.id, paymentToDelete.id)
      ),
    });

    updateInvoice(updatedInvoice);
    deleteReceiptForPayment(updatedInvoice.id, paymentToDelete.id);
    setInvoices((currentInvoices) => currentInvoices.map((currentInvoice) =>
      relationshipIdsEqual(currentInvoice.id, updatedInvoice.id) ? updatedInvoice : currentInvoice
    ));
    setPaymentToDelete(null);
    showToast({
      type: "success",
      title: "Payment deleted",
      message: "Payment deleted successfully",
    });
  }

  function handleDelete() {
    try {
      const remainingInvoices = deleteInvoice(invoice.id);
      setInvoices(remainingInvoices);
      showToast({ type: "success", title: "Invoice deleted", message: "Invoice deleted successfully" });
      navigate("/invoices");
    } catch (error) {
      setIsDeleteOpen(false);
      showToast({ type: "warning", title: "Invoice history protected", message: error.message });
    }
  }

  if (!invoice) {
    return (
      <MainLayout>
        <h1 className="text-3xl font-bold p-8">
          Invoice not found
        </h1>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div
        id="invoice-print"
        className="bg-white rounded-xl shadow-lg p-4 sm:p-8"
      >
        {/* Header */}

        <div className="invoice-print-header flex flex-col items-start gap-6 border-b pb-8 mb-8 lg:flex-row lg:justify-between">

          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:gap-5">

            {company.logo && (
              <img
                src={company.logo}
                alt="Logo"
                className="w-24 h-24 rounded-lg border object-contain"
              />
            )}

            <div className="min-w-0 break-words">

              <h1 className="break-words text-3xl font-bold sm:text-4xl">
                {company.name}
              </h1>

              <p className="text-gray-600">
                {company.tagline}
              </p>

              <p>{company.address}</p>

              <p>{company.phone}</p>

              <p>{company.email}</p>

              <p>{company.website}</p>

            </div>

          </div>

          <div className="w-full min-w-0 lg:w-auto lg:text-right">

            <h2 className="text-4xl font-bold sm:text-5xl">
              INVOICE
            </h2>

            <p className="mt-2 font-semibold">
              {invoice.invoiceNumber}
            </p>

            <span className="inline-block mt-3 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">
              {invoiceStatus}
            </span>

            <div className="no-print mt-5 flex flex-wrap justify-start gap-2 lg:justify-end">

              <button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Print
              </button>

              <button
                onClick={() => window.history.back()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Back
              </button>

              <button
                onClick={() => setIsDeleteOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Delete Invoice
              </button>

            </div>

          </div>

        </div>

        {/* Customer */}

        <div className="invoice-print-customer grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <div className="bg-slate-50 p-5 rounded-xl">

            <p className="text-gray-500">
              Client
            </p>

            <h3 className="font-bold text-xl mt-2">
              {invoice.clientNameSnapshot || invoice.client || "Not linked"}
            </h3>

          </div>

          <div className="bg-slate-50 p-5 rounded-xl">

            <p className="text-gray-500">
              Project
            </p>

            <h3 className="font-bold text-xl mt-2">
              {invoice.projectNameSnapshot || invoice.project || "—"}
            </h3>

          </div>

          <div className="bg-slate-50 p-5 rounded-xl">

            <p className="text-gray-500">
              Date
            </p>

            <h3 className="font-bold text-xl mt-2">
              {invoice.date}
            </h3>

          </div>

          <div className="bg-slate-50 p-5 rounded-xl">

            <p className="text-gray-500">
              Status
            </p>

            <h3 className="font-bold text-xl mt-2">
              {invoiceStatus}
            </h3>

          </div>

        </div>

        {/* Materials */}

        <h2 className="invoice-print-materials-title text-2xl font-bold mb-4">
          Materials
        </h2>

        <table className="invoice-print-materials w-full border border-collapse mb-10">

          <thead className="bg-slate-100">

            <tr>

              <th className="border p-3">
                Description
              </th>

              <th className="border p-3">
                Qty
              </th>

              <th className="border p-3">
                Unit Price
              </th>

              <th className="border p-3">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {(Array.isArray(invoice.materials) ? invoice.materials : []).filter(Boolean).map((item, itemIndex) => (

              <tr key={item.id ?? `legacy-item-${itemIndex}`}>

                <td className="border p-3">
                  {item.description || item.name || "—"}
                </td>

                <td className="border p-3 text-center">
                  {Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 0}
                </td>

                <td className="border p-3 text-right">
                  {formatCurrency(safeDocumentAmount(item.price))}
                </td>

                <td className="border p-3 text-right">
                  {formatCurrency(Number.isFinite(Number(item.price) * Number(item.quantity))
                    ? Number(item.price) * Number(item.quantity)
                    : 0)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>
                {/* Totals */}

        <div className="invoice-print-totals flex justify-end mb-10">

          <div className="w-96 bg-white rounded-xl border shadow-lg p-6">

            <div className="flex justify-between py-2">
              <span>Labour</span>
              <span>
                {formatCurrency(safeDocumentAmount(invoice.labour))}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span>Transport</span>
              <span>
                {formatCurrency(safeDocumentAmount(invoice.transport))}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span>Discount</span>
              <span>
                -{formatCurrency(Math.max(0, safeDocumentAmount(invoice.discount)))}
              </span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between font-semibold">
              <span>Total Paid</span>
              <span>
                {formatCurrency(currentAmountPaid)}
              </span>
            </div>

            <div className="flex justify-between font-semibold mt-2">
              <span>Balance</span>
              <span className="text-red-600">
                {formatCurrency(remainingBalance)}
              </span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between text-2xl font-bold">

              <span>Grand Total</span>

              <span>
                {formatCurrency(Math.max(0, safeDocumentAmount(invoice.total)))}
              </span>

            </div>

          </div>

        </div>

        {/* Record Payment */}

        {remainingBalance > 0 ? <div className="no-print mb-10 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">

          <h2 className="text-2xl font-bold mb-6">
            Record Payment
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            <input
              type="number"
              placeholder="Amount"
              max={remainingBalance}
              min="0.01"
              step="0.01"
              value={payment.amount}
              onChange={(e) =>
                setPayment({
                  ...payment,
                  amount: e.target.value,
                })
              }
              className="border rounded-lg p-3"
            />

            <select
              value={payment.method}
              onChange={(e) =>
                setPayment({
                  ...payment,
                  method: e.target.value,
                })
              }
              className="border rounded-lg p-3"
            >
              <option>Cash</option>
              <option>Mobile Money</option>
              <option>Bank Transfer</option>
              <option>Cheque</option>
            </select>

            <input
              type="text"
              placeholder="Reference"
              value={payment.reference}
              onChange={(e) =>
                setPayment({
                  ...payment,
                  reference: e.target.value,
                })
              }
              className="border rounded-lg p-3"
            />

            <input
              type="date"
              value={payment.date}
              onChange={(e) =>
                setPayment({
                  ...payment,
                  date: e.target.value,
                })
              }
              className="border rounded-lg p-3"
            />

          </div>

          <button
            onClick={savePayment}
            disabled={isSavingPayment}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            {isSavingPayment ? "Saving..." : "Record Payment"}
          </button>

        </div> : <div className="no-print mb-10 rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-semibold text-emerald-800">
          Paid in full. No further payment is required.
        </div>}

        {/* Payment History */}

        <div className="no-print break-inside-avoid">

          <h2 className="text-2xl font-bold mb-4">
            Payment History
          </h2>

          {invoicePayments.length === 0 ? (

            <p className="text-gray-500">
              No payments recorded.
            </p>

          ) : (

            <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[760px] border-collapse text-sm">

              <thead className="bg-slate-100 text-left text-slate-600">

                <tr>

                  <th className="border p-3">
                    Date
                  </th>

                  <th className="border p-3">
                    Method
                  </th>

                  <th className="border p-3">
                    Reference
                  </th>

                  <th className="border p-3">
                    Amount
                  </th>

                  <th className="border p-3 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {invoicePayments.map((pay, paymentIndex) => (

                  <tr key={hasRelationshipId(pay.id) ? `${typeof pay.id}:${String(pay.id)}` : `legacy-payment-${paymentIndex}`}>

                    <td className="border-b border-slate-100 p-3">
                      {pay.date}
                    </td>

                    <td className="border-b border-slate-100 p-3">
                      {pay.method}
                    </td>

                    <td className="border-b border-slate-100 p-3 text-slate-600">
                      {pay.reference || "-"}
                    </td>

                    <td className="border-b border-slate-100 p-3 text-right font-semibold text-emerald-700">
                      {formatCurrency(Math.max(0, safeDocumentAmount(pay.amount)))}
                    </td>

                    <td className="border-b border-slate-100 p-3">
                      {hasRelationshipId(pay.id) ? <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          variant="secondary"
                          className="min-h-9 px-3 py-1 text-sm"
                          onClick={() => startEditingPayment(pay)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          className="min-h-9 px-3 py-1 text-sm"
                          onClick={() => setPaymentToDelete(pay)}
                        >
                          Delete
                        </Button>
                      </div> : <span className="text-sm text-slate-500">Legacy record</span>}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
            </div>

          )}

        </div>

      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Invoice?"
        message={`Are you sure you want to delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        confirmLabel="Delete Invoice"
      />

      <Modal
        isOpen={Boolean(editingPayment)}
        title="Edit Payment"
        onClose={() => setEditingPayment(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingPayment(null)}>
              Cancel
            </Button>
            <Button onClick={saveEditedPayment}>Save Payment</Button>
          </>
        }
      >
        {editingPayment && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Amount
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={editingPayment.amount}
                onChange={(event) => setEditingPayment({
                  ...editingPayment,
                  amount: event.target.value,
                })}
                className="min-h-11 rounded-lg border border-slate-300 px-3"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Payment Method
              <select
                value={editingPayment.method}
                onChange={(event) => setEditingPayment({
                  ...editingPayment,
                  method: event.target.value,
                })}
                className="min-h-11 rounded-lg border border-slate-300 px-3"
              >
                <option>Cash</option>
                <option>Bank Transfer</option>
                <option>Mobile Money</option>
                <option>Cheque</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700 sm:col-span-2">
              Reference
              <input
                type="text"
                value={editingPayment.reference}
                onChange={(event) => setEditingPayment({
                  ...editingPayment,
                  reference: event.target.value,
                })}
                className="min-h-11 rounded-lg border border-slate-300 px-3"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700 sm:col-span-2">
              Date
              <input
                type="date"
                value={editingPayment.date}
                onChange={(event) => setEditingPayment({
                  ...editingPayment,
                  date: event.target.value,
                })}
                className="min-h-11 rounded-lg border border-slate-300 px-3"
              />
            </label>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(paymentToDelete)}
        title="Delete Payment?"
        message={`Are you sure you want to delete this ${paymentToDelete ? formatCurrency(paymentToDelete.amount) : ""} payment? This action cannot be undone.`}
        onCancel={() => setPaymentToDelete(null)}
        onConfirm={deletePayment}
        confirmLabel="Delete Payment"
      />

    </MainLayout>
  );
}

export default InvoiceDetails;
