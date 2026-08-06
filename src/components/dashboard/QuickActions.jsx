import { useNavigate } from "react-router-dom";
import Card from "../common/Card";

const actions = [
  { label: "New Client", path: "/clients" },
  { label: "New Project", path: "/projects" },
  { label: "New Quotation", path: "/quotations" },
  { label: "New Invoice", path: "/invoices" },
  { label: "Record Payment", path: "/invoices" },
];

function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card className="mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
        <p className="text-sm text-slate-500">Start a common task in one click.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => navigate(action.path)}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {action.label}
          </button>
        ))}
      </div>
    </Card>
  );
}

export default QuickActions;
