import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import EmptyReport from "./EmptyReport";

function ExpenseReport() {
  const { expenses = [] } = useApp();
  return <Card><h2 className="text-lg font-semibold text-slate-800">Expense Report</h2><div className="mt-4 overflow-x-auto">{expenses.length === 0 ? <EmptyReport /> : <table className="w-full min-w-[600px] text-sm"><thead className="border-b border-slate-200 text-left text-slate-500"><tr><th className="p-3">Category</th><th className="p-3">Description</th><th className="p-3 text-right">Amount</th></tr></thead><tbody>{expenses.map((expense) => <tr key={expense.id} className="border-b border-slate-100"><td className="p-3">{expense.category || "—"}</td><td className="p-3">{expense.description || "—"}</td><td className="p-3 text-right">GH₵ {(Number(expense.amount) || 0).toLocaleString()}</td></tr>)}</tbody></table>}</div></Card>;
}

export default ExpenseReport;
