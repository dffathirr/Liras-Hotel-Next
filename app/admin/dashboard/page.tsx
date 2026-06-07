import StatistikBooking from "./components/StatistikBooking";
import StatistikKamar from "./components/StatistikKamar";
import StatistikRevenue from "./components/StatistikRevenue";
import Widgets from "./components/Widgets";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2>Dashboard</h2>
        <p className="text-muted">Hotel Booking Management System</p>
      </div>

      <Widgets />

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <StatistikBooking />
        </div>

        <div className="col-md-8">
          <StatistikKamar />
        </div>
      </div>

      <StatistikRevenue />
    </div>
  );
}
