import { useMemo } from "react";
import { useApp } from "../../context/AppContext";

function ExpenseSummary() {
  const { expenses } = useApp();

  const today = new Date().toISOString().split("T")[0];

  const todayTotal = useMemo(() => {
    return expenses
      .filter((expense) => expense.date === today)
      .reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      );
  }, [expenses, today]);

  const monthTotal = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);

        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      );
  }, [expenses]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-gray-500 text-sm">
          Today's Expenses
        </h3>

        <p className="text-2xl font-bold text-red-600">
          GH₵ {todayTotal.toLocaleString()}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-gray-500 text-sm">
          This Month
        </h3>

        <p className="text-2xl font-bold text-orange-600">
          GH₵ {monthTotal.toLocaleString()}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-gray-500 text-sm">
          Total Expenses
        </h3>

        <p className="text-2xl font-bold text-red-700">
          GH₵ {totalExpenses.toLocaleString()}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-gray-500 text-sm">
          Number of Expenses
        </h3>

        <p className="text-2xl font-bold text-blue-600">
          {expenses.length}
        </p>
      </div>
    </div>
  );
}

export default ExpenseSummary;