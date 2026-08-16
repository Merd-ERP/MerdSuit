import MainLayout from "../layouts/Mainlayout";
import PageHeader from "../components/common/PageHeader";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import AlertsPanel from "../components/dashboard/AlertsPanel";
import RevenueChart from "../components/dashboard/RevenueChart";
import HelpTip from "../components/dashboard/HelpTip";

function Dashboard() {
  return (
    <MainLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back. Here's an overview of your business."
      />

      <DashboardHeader />
      <DashboardStats />
      <QuickActions />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        <AlertsPanel />
      </div>

      <RevenueChart />
      <HelpTip />
    </MainLayout>
  );
}

export default Dashboard;
