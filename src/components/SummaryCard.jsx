function SummaryCard({
  materialTotal,
  labour,
  transport,
  discount,
  finalTotal,
}) {
  return (
    <div className="mt-10 flex justify-end gap-4 border-t pt-6">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-slate-800 text-white px-6 py-4">
          <h2 className="text-xl font-bold">
            📊 Quotation Summary
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          <div className="flex justify-between">
            <span>Materials</span>
            <span className="font-semibold">
              GH₵ {materialTotal.toLocaleString("en-GB", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Labour</span>
            <span className="font-semibold">
              GH₵ {Number(labour).toLocaleString("en-GB", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Transport</span>
            <span className="font-semibold">
              GH₵ {Number(transport).toLocaleString("en-GB", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex justify-between text-red-600">
            <span>Discount</span>
            <span className="font-semibold">
              - GH₵ {Number(discount).toLocaleString("en-GB", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <hr />

          {/* Grand Total */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex justify-between items-center">
            <span className="text-2xl font-bold text-green-700">
              Grand Total
            </span>

            <span className="text-2xl font-bold text-green-700">
              GH₵ {finalTotal.toLocaleString("en-GB", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default SummaryCard;