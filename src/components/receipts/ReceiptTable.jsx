import { Link } from "react-router-dom";
import Card from "../common/Card";
import EmptyReceipts from "./EmptyReceipts";
import { formatCurrency } from "../../utils/currency";

function ReceiptTable({ receipts }) { return <Card><h2 className="text-xl font-semibold text-slate-800">Receipt History</h2>{receipts.length === 0 ? <EmptyReceipts /> : <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[700px] text-sm"><thead className="border-b border-slate-200 text-left text-slate-500"><tr><th className="p-3">Receipt No.</th><th className="p-3">Invoice</th><th className="p-3">Client</th><th className="p-3">Date</th><th className="p-3">Method</th><th className="p-3 text-right">Amount</th></tr></thead><tbody>{receipts.map((receipt) => <tr key={receipt.id} className="border-b border-slate-100"><td className="p-3"><Link to={`/receipt/${receipt.id}`} className="font-semibold text-blue-600 hover:underline">{receipt.receiptNumber}</Link></td><td className="p-3">{receipt.invoiceNumber}</td><td className="p-3">{receipt.client}</td><td className="p-3">{receipt.date}</td><td className="p-3">{receipt.method}</td><td className="p-3 text-right">{formatCurrency(receipt.amount)}</td></tr>)}</tbody></table></div>}</Card>; }
export default ReceiptTable;
