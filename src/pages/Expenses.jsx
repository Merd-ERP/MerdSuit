import { useState } from "react";

import MainLayout from "../layouts/MainLayout";

import ExpenseSummary from "../components/expenses/ExpenseSummary";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseTable from "../components/expenses/ExpenseTable";

function Expenses() {
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  return (
    <MainLayout>
      <div className="space-y-6">
        <ExpenseSummary />

        <ExpenseForm
          expenseToEdit={expenseToEdit}
          setExpenseToEdit={setExpenseToEdit}
        />

        <ExpenseTable
          setExpenseToEdit={setExpenseToEdit}
        />
      </div>
    </MainLayout>
  );
}

export default Expenses;