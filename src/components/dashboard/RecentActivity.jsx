import Card from "../common/Card";

function RecentActivity() {
  const activities = [];

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
      <div className="mt-4 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
        {activities.length === 0 ? "No recent activity." : activities.map((activity) => activity)}
      </div>
    </Card>
  );
}

export default RecentActivity;
