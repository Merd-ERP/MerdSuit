import { formatCurrency } from "../../utils/currency";

function SummaryCard({
  materialTotal,
  labour,
  transport,
  discount,
  finalTotal,
}) {
  return (
    <div className="mt-8 flex justify-end">
      <div className="w-full max-w-sm rounded-xl bg-gray-50 p-6 shadow">
        <div className="mb-2 flex justify-between">
          <span>Materials</span>
          <span>{formatCurrency(materialTotal)}</span>
        </div>

        {Number(labour) > 0 && (
          <div className="mb-2 flex justify-between">
            <span>Labour</span>
            <span>{formatCurrency(labour)}</span>
          </div>
        )}

        {Number(transport) > 0 && (
          <div className="mb-2 flex justify-between">
            <span>Transport</span>
            <span>{formatCurrency(transport)}</span>
          </div>
        )}

        {Number(discount) > 0 && (
          <div className="mb-2 flex justify-between text-red-600">
            <span>Discount</span>
            <span>- {formatCurrency(discount)}</span>
          </div>
        )}

        <hr className="my-3" />

        <div className="flex justify-between text-2xl font-bold text-green-700">
          <span>Grand Total</span>
          <span>{formatCurrency(finalTotal)}</span>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
