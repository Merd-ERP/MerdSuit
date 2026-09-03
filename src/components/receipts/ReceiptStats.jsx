import Card from "../common/Card";
import { formatCurrency } from "../../utils/currency";

function ReceiptStats({ receipts }) { const total = receipts.reduce((sum, receipt) => { const amount = Number(receipt.amount); return sum + (Number.isFinite(amount) && amount > 0 ? amount : 0); }, 0); return <section className="mb-6 grid gap-4 sm:grid-cols-2"><Card className="p-5"><p className="text-sm font-medium text-slate-500">Total Receipts</p><p className="mt-2 text-2xl font-bold text-blue-600">{receipts.length}</p></Card><Card className="p-5"><p className="text-sm font-medium text-slate-500">Payments Received</p><p className="mt-2 text-2xl font-bold text-emerald-600">{formatCurrency(total)}</p></Card></section>; }
export default ReceiptStats;
