import Card from "../common/Card";

function StatCard({ label, value, accentClass = "text-blue-600" }) {
  return (
    <Card className="min-w-0 p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 min-w-0 break-words text-2xl font-bold sm:text-3xl ${accentClass}`}>{value}</p>
    </Card>
  );
}

export default StatCard;
