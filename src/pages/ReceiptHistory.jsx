import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getReceipts } from "../services/receiptService";

function ReceiptHistory() {
  const receipts = getReceipts();

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow p-8">

        <h1 className="text-3xl font-bold mb-8">
          Receipt History
        </h1>

        <table className="w-full border border-collapse">

          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Receipt No.</th>
              <th className="border p-3">Invoice</th>
              <th className="border p-3">Client</th>
              <th className="border p-3">Date</th>
              <th className="border p-3">Method</th>
              <th className="border p-3">Amount</th>
            </tr>
          </thead>

          <tbody>

            {receipts.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  className="border p-8 text-center text-gray-500"
                >
                  No receipts found.
                </td>
              </tr>

            ) : (

              receipts.map((receipt) => (

                <tr key={receipt.id}>

                  <td className="border p-3">

                    <Link
                      to={`/receipt/${receipt.id}`}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      {receipt.receiptNumber}
                    </Link>

                  </td>

                  <td className="border p-3">
                    {receipt.invoiceNumber}
                  </td>

                  <td className="border p-3">
                    {receipt.client}
                  </td>

                  <td className="border p-3">
                    {receipt.date}
                  </td>

                  <td className="border p-3">
                    {receipt.method}
                  </td>

                  <td className="border p-3 text-right">
                    GH₵ {Number(receipt.amount).toLocaleString()}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>
    </MainLayout>
  );
}

export default ReceiptHistory;