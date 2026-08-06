import Card from "../common/Card";

function HelpTip() {
  return (
    <Card className="mt-6 border-l-4 border-l-blue-500">
      <h2 className="text-lg font-semibold text-slate-800">Business Tip</h2>
      <p className="mt-2 text-sm text-slate-600">
        Remember to follow up on unpaid invoices to improve cash flow.
      </p>
    </Card>
  );
}

export default HelpTip;
