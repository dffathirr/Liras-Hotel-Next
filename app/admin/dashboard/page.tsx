export default function DashboardPage() {
  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-0">Dashboard</h4>
        <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
          Selamat datang di panel admin Liras Hotel
        </p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-5 text-center">
          <i className="fas fa-chart-bar fa-3x mb-3 text-muted opacity-25" />
          <p className="text-muted">Dashboard dalam pengembangan.</p>
          <a href="/admin/booking" className="btn btn-primary btn-sm">
            Lihat Booking
          </a>
        </div>
      </div>
    </div>
  );
}
