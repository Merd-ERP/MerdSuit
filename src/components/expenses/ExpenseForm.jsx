import { useState } from "react";

import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import {
  findByRelationshipOptionValue,
  getProjectOptionLabel,
  isArchivedRecord,
  relationshipIdsEqual,
  relationshipOptionValue,
  resolveClient,
  resolveProject,
} from "../../utils/relationships";

import Button from "../common/Button";

function ExpenseForm({
  expenseToEdit,
  setExpenseToEdit,
}) {
  const {
    addExpense,
    updateExpense,
    clients,
    projects,
  } = useApp();

  const { showToast } = useToast();

  const emptyExpense = {
    date: new Date().toISOString().split("T")[0],
    category: "Transport",
    description: "",
    amount: 0,
    paymentMethod: "Cash",
    projectId: "",
    notes: "",
  };

  const editingId = expenseToEdit?.id;
  const isEditing = editingId !== undefined && editingId !== null;
  const [expense, setExpense] = useState(() => expenseToEdit || emptyExpense);
  const selectedProject = resolveProject(expense, projects);
  const availableProjects = projects.filter(
    (project) => {
      const isSelectedProject = relationshipIdsEqual(project.id, selectedProject?.id);
      const projectClient = resolveClient(project, clients);
      return isSelectedProject || (
        !isArchivedRecord(project)
        && (!projectClient || !isArchivedRecord(projectClient))
      );
    }
  );

  function resetForm() {
    setExpenseToEdit(null);
    setExpense(emptyExpense);
  }

  function handleSave() {
    if (!expense.description.trim()) {
      showToast({
        type: "warning",
        title: "Description Required",
        message: "Please enter an expense description.",
      });

      return;
    }

    if (Number(expense.amount) <= 0) {
      showToast({
        type: "warning",
        title: "Invalid Amount",
        message: "Expense amount must be greater than zero.",
      });

      return;
    }

    const newExpense = {
      id: editingId ?? Date.now(),
      ...expense,
      amount: Number(expense.amount),
    };

    if (isEditing) {
      updateExpense(newExpense);

      showToast({
        type: "success",
        title: "Updated",
        message: "Expense updated successfully.",
      });
    } else {
      addExpense(newExpense);

      showToast({
        type: "success",
        title: "Saved",
        message: "Expense added successfully.",
      });
    }

    resetForm();
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Expense" : "Add Expense"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          type="date"
          className="border rounded-lg p-2"
          value={expense.date}
          onChange={(e) =>
            setExpense({
              ...expense,
              date: e.target.value,
            })
          }
        />

        <select
          className="border rounded-lg p-2"
          value={expense.category}
          onChange={(e) =>
            setExpense({
              ...expense,
              category: e.target.value,
            })
          }
        >
          <option>Labour</option>
          <option>Transport</option>
          <option>Fuel</option>
          <option>Materials</option>
          <option>Feeding</option>
          <option>Utilities</option>
          <option>Maintenance</option>
          <option>Tools & Equipment</option>
          <option>Miscellaneous</option>
        </select>

        <input
          className="border rounded-lg p-2"
          placeholder="Description"
          value={expense.description}
          onChange={(e) =>
            setExpense({
              ...expense,
              description: e.target.value,
            })
          }
        />

        <input
          type="number"
          className="border rounded-lg p-2"
          placeholder="Amount"
          value={expense.amount}
          onChange={(e) =>
            setExpense({
              ...expense,
              amount: e.target.value,
            })
          }
        />

        <select
          className="border rounded-lg p-2"
          value={expense.paymentMethod}
          onChange={(e) =>
            setExpense({
              ...expense,
              paymentMethod: e.target.value,
            })
          }
        >
          <option>Cash</option>
          <option>Mobile Money</option>
          <option>Bank Transfer</option>
          <option>Cheque</option>
        </select>

        <select
          className="border rounded-lg p-2"
          value={relationshipOptionValue(selectedProject?.id)}
          onChange={(e) => {
            const project = findByRelationshipOptionValue(projects, e.target.value);
            setExpense({ ...expense, projectId: project?.id ?? "" });
          }}
        >
          <option value="">
            No Project
          </option>

          {availableProjects.map((project) => (
            <option
              key={relationshipOptionValue(project.id)}
              value={relationshipOptionValue(project.id)}
            >
              {getProjectOptionLabel(project, clients)}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="border rounded-lg p-2 w-full mt-4"
        rows="4"
        placeholder="Notes..."
        value={expense.notes}
        onChange={(e) =>
          setExpense({
            ...expense,
            notes: e.target.value,
          })
        }
      />

      <div className="flex gap-3 mt-6">
        <Button
          variant={isEditing ? "warning" : "primary"}
          onClick={handleSave}
        >
          {isEditing
            ? "Update Expense"
            : "Save Expense"}
        </Button>

        {isEditing && (
          <Button
            variant="secondary"
            onClick={resetForm}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

export default ExpenseForm;
