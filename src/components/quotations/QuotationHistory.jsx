import {
  getQuotations,
  updateQuotation,
} from "../../services/quotationService";

import {
  saveInvoice,
  generateInvoiceNumber,
} from "../../services/invoiceService";

function QuotationHistory() {
  const quotations = getQuotations();

  function handleConvert(quotation) {
    if (quotation.status === "Converted") {
      alert("This quotation has already been converted.");
      return;
    }

    const invoice = {
      id: Date.now(),
      invoiceNumber: generateInvoiceNumber(),

      quotationNumber: quotation.quotationNumber,

      client: quotation.client,
      project: quotation.project,
      date: new Date().toISOString().split("T")[0],

      materials: quotation.materials,

      labour: quotation.labour,
      transport: quotation.transport,
      discount: quotation.discount,

      total: quotation.total,

      status: "Unpaid",
    };

    saveInvoice(invoice);

    updateQuotation({
      ...quotation,
      status: "Converted",
    });

    alert("Invoice created successfully!");

    window.location.reload();
  }

  return (
    <div className="mt-10">

      <h2 className="text-2xl font-bold mb-4">
        Saved Quotations
      </h2>

      {quotations.length === 0 ? (

        <p className="text-gray-500">
          No quotations saved yet.
        </p>

      ) : (

        <table className="w-full border-collapse border">

          <thead className="bg-gray-100">

            <tr>
              <th className="border p-2">Quotation No.</th>
              <th className="border p-2">Client</th>
              <th className="border p-2">Project</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>

          </thead>

          <tbody>

            {quotations.map((quotation) => (

              <tr key={quotation.id}>

                <td className="border p-2">
                  {quotation.quotationNumber}
                </td>

                <td className="border p-2">
                  {quotation.client}
                </td>

                <td className="border p-2">
                  {quotation.project}
                </td>

                <td className="border p-2">
                  GH₵ {quotation.total.toLocaleString()}
                </td>

                <td className="border p-2">
                  {quotation.status}
                </td>

                <td className="border p-2">

                  {quotation.status === "Pending" ? (

                    <button
                      onClick={() => handleConvert(quotation)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                    >
                      Convert
                    </button>

                  ) : (

                    <span className="text-green-700 font-semibold">
                      Converted
                    </span>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}

export default QuotationHistory;