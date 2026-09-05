import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import Button from "../common/Button";

const actions = [
  { label: "New Client", path: "/clients" },
  { label: "New Project", path: "/projects" },
  { label: "New Quotation", path: "/quotations" },
  { label: "New Invoice", path: "/quotations" },
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
          <Button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="w-full text-sm sm:w-auto"
          >
            {action.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}

export default QuickActions;
