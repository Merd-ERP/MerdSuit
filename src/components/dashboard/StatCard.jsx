import Card from "../common/Card";

function StatCard({ label, value, accentClass = "text-blue-600" }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accentClass}`}>{value}</p>
    </Card>
  );
}

export default StatCard;
