import { useState } from "react";

import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";

import Button from "../common/Button";
import SearchBox from "../common/SearchBox";
import EmptyState from "../common/EmptyState";
import { formatCurrency } from "../../utils/currency";

function ExpenseTable({ setExpenseToEdit }) {
  const {
    expenses,
    projects,
    deleteExpense,
  } = useApp();

  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredExpenses = expenses.filter((expense) => {
    const project = projects.find(
      (p) => String(p.id) === String(expense.projectId)
    );

    const projectName = project?.name || "";

    const text = search.toLowerCase();

    const matchesSearch = (
      expense.category.toLowerCase().includes(text) ||
      expense.description.toLowerCase().includes(text) ||
      expense.paymentMethod.toLowerCase().includes(text) ||
      projectName.toLowerCase().includes(text)
    );

    return matchesSearch && (category === "All" || expense.category === category);
  });

  function handleDelete(id) {
    if (!window.confirm("Delete this expense?")) return;

    deleteExpense(id);

    showToast({
      type: "success",
      title: "Deleted",
      message: "Expense deleted successfully.",
    });
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Expenses
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SearchBox
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Expenses..."
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-300 p-3"
        >
          <option>All</option>
          <option>Labour</option><option>Transport</option><option>Fuel</option>
          <option>Materials</option><option>Feeding</option><option>Utilities</option>
          <option>Maintenance</option><option>Tools & Equipment</option><option>Miscellaneous</option>
        </select>
      </div>

      {filteredExpenses.length === 0 ? (
        <EmptyState
          title="No Expenses"
          message="Add your first expense."
        />
      ) : (
        <div className="overflow-x-auto mt-5">
          <table className="w-full min-w-[760px] border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Project</th>
                <th className="border p-2">Payment</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.map((expense) => {
                const project = projects.find(
                  (p) =>
                    String(p.id) ===
                    String(expense.projectId)
                );

                return (
                  <tr key={expense.id}>
                    <td className="border p-2">
                      {expense.date}
                    </td>

                    <td className="border p-2">
                      {expense.category}
                    </td>

                    <td className="border p-2">
                      {expense.description}
                    </td>

                    <td className="border p-2">
                      {project?.name || "-"}
                    </td>

                    <td className="border p-2">
                      {expense.paymentMethod}
                    </td>

                    <td className="border p-2 font-semibold text-red-600">
                      {formatCurrency(expense.amount)}
                    </td>

                    <td className="border p-2">
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="warning"
                          onClick={() =>
                            setExpenseToEdit(expense)
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() =>
                            handleDelete(expense.id)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExpenseTable;
