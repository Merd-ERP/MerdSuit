import Card from "../common/Card";

function SummaryCard({ label, value, description, accentClass = "text-blue-600" }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${accentClass}`}>{value}</p>
      {description && (
        <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
      )}
    </Card>
  );
}

export default SummaryCard;
