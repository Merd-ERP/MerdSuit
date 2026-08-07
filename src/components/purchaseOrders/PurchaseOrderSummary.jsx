function PurchaseOrderSummary({ materialTotal, transport, discount, grandTotal }) {
  return <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5"><h3 className="text-lg font-semibold text-slate-800">Order Summary</h3><div className="mt-3 space-y-2 text-sm text-slate-600"><p>Material Total: <strong className="float-right text-slate-800">GH₵ {materialTotal.toFixed(2)}</strong></p><p>Transport: <strong className="float-right text-slate-800">GH₵ {transport.toFixed(2)}</strong></p><p>Discount: <strong className="float-right text-slate-800">GH₵ {discount.toFixed(2)}</strong></p><p className="border-t border-slate-200 pt-3 text-lg font-bold text-slate-800">Grand Total: <span className="float-right text-blue-600">GH₵ {grandTotal.toFixed(2)}</span></p></div></div>;
}

export default PurchaseOrderSummary;
