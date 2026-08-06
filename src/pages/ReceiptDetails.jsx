import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getReceipts } from "../services/receiptService";

function ReceiptDetails() {
  const { id } = useParams();

  const receipts = getReceipts();

  const receipt = receipts.find(
    (r) => r.id.toString() === id
  );

  const company =
    JSON.parse(localStorage.getItem("company")) || {};

  if (!receipt) {
    return (
      <MainLayout>
        <h1 className="text-3xl font-bold p-8">
          Receipt not found
        </h1>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div
        id="receipt-print"
        className="bg-white rounded-xl shadow p-8"
      >

        <div className="flex justify-between">

          <div>

            <h1 className="text-4xl font-bold">
              {company.name}
            </h1>

            <p>{company.tagline}</p>
            <p>{company.address}</p>
            <p>{company.phone}</p>
            <p>{company.email}</p>

          </div>

         <div className="text-right">

  <h2 className="text-5xl font-bold">
    RECEIPT
  </h2>

  <p className="mt-2 text-2xl">
    {receipt.receiptNumber}
  </p>

  <div className="flex gap-2 justify-end mt-6">

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

  </div>

</div>

        </div>

        <hr className="my-8" />

        <div className="grid grid-cols-2 gap-8">

          <div>

            <h3 className="font-bold">
              Client
            </h3>

            <p>{receipt.client}</p>

          </div>

          <div>

            <h3 className="font-bold">
              Invoice
            </h3>

            <p>{receipt.invoiceNumber}</p>

          </div>

          <div>

            <h3 className="font-bold">
              Date
            </h3>

            <p>{receipt.date}</p>

          </div>

          <div>

            <h3 className="font-bold">
              Method
            </h3>

            <p>{receipt.method}</p>

          </div>

          <div>

            <h3 className="font-bold">
              Reference
            </h3>

            <p>{receipt.reference}</p>

          </div>

        </div>

        <hr className="my-8" />

        <div className="text-center">

          <h2 className="text-2xl font-bold">
            Amount Received
          </h2>

          <p className="text-5xl font-bold text-green-600 mt-4">
            GH₵ {Number(receipt.amount).toLocaleString()}
          </p>

        </div>

        <hr className="my-8" />

        <p className="text-center text-gray-500">
          Thank you for your business.
        </p>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Print
          </button>

          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 text-white px-5 py-2 rounded-lg"
          >
            Back
          </button>

        </div>

      </div>

    </MainLayout>
  );
}

export default ReceiptDetails;