import Card from "../common/Card";

function ReceiptStats({ receipts }) { const total = receipts.reduce((sum, receipt) => sum + (Number(receipt.amount) || 0), 0); return <section className="mb-6 grid gap-4 sm:grid-cols-2"><Card className="p-5"><p className="text-sm font-medium text-slate-500">Total Receipts</p><p className="mt-2 text-2xl font-bold text-blue-600">{receipts.length}</p></Card><Card className="p-5"><p className="text-sm font-medium text-slate-500">Payments Received</p><p className="mt-2 text-2xl font-bold text-emerald-600">GH₵ {total.toLocaleString()}</p></Card></section>; }
export default ReceiptStats;
