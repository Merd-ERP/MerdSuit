function SummaryCard({
  materialTotal,
  labour,
  transport,
  discount,
  finalTotal,
}) {
  return (
    <div className="flex justify-end mt-8">

      <div className="w-96 bg-gray-50 rounded-xl shadow p-6">

        <div className="flex justify-between mb-2">
          <span>Materials</span>
          <span>GH₵ {materialTotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Labour</span>
          <span>GH₵ {Number(labour).toLocaleString()}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Transport</span>
          <span>GH₵ {Number(transport).toLocaleString()}</span>
        </div>

        <div className="flex justify-between mb-2 text-red-600">
          <span>Discount</span>
          <span>- GH₵ {Number(discount).toLocaleString()}</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between text-2xl font-bold text-green-700">
          <span>Grand Total</span>
          <span>GH₵ {finalTotal.toLocaleString()}</span>
        </div>

      </div>

    </div>
  );
}

export default SummaryCard;