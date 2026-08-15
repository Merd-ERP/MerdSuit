import { formatCurrency } from "../../utils/currency";

function PurchaseOrderSummary({ materialTotal, transport, discount, grandTotal }) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-lg font-semibold text-slate-800">Order Summary</h3>
      <div className="mt-3 space-y-2 text-sm text-slate-600">
        <p>Material Total: <strong className="float-right text-slate-800">{formatCurrency(materialTotal, { minimumFractionDigits: 2 })}</strong></p>
        {transport > 0 && <p>Transport: <strong className="float-right text-slate-800">{formatCurrency(transport, { minimumFractionDigits: 2 })}</strong></p>}
        {discount > 0 && <p>Discount: <strong className="float-right text-red-600">- {formatCurrency(discount, { minimumFractionDigits: 2 })}</strong></p>}
        <p className="border-t border-slate-200 pt-3 text-lg font-bold text-slate-800">Grand Total: <span className="float-right text-blue-600">{formatCurrency(grandTotal, { minimumFractionDigits: 2 })}</span></p>
      </div>
    </div>
  );
}

export default PurchaseOrderSummary;
