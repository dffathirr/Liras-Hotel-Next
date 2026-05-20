export default function DashboardPage() {
  return (
    <>
      {/* Page Header */}
      <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
        <div className="my-auto">
          <h1 className="page-title fw-semibold fs-18 mb-0">Dashboard</h1>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center">
          <div className="pe-1 mb-xl-0">
            <button type="button" className="btn btn-light btn-sm">Today</button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row">
        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12">
          <div className="card custom-card">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                  <span className="d-block mb-1 text-muted fs-13">Total Rooms</span>
                  <h3 className="fw-semibold mb-0">48</h3>
                </div>
                <span className="avatar avatar-md bg-primary-transparent rounded-circle">
                  <i className="ri-hotel-bed-line fs-18 text-primary"></i>
                </span>
              </div>
              <div className="d-flex align-items-center">
                <span className="badge bg-success-transparent me-2">
                  <i className="ri-arrow-up-s-line me-1"></i>8%
                </span>
                <span className="text-muted fs-12">vs last month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12">
          <div className="card custom-card">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                  <span className="d-block mb-1 text-muted fs-13">Occupied</span>
                  <h3 className="fw-semibold mb-0">32</h3>
                </div>
                <span className="avatar avatar-md bg-success-transparent rounded-circle">
                  <i className="ri-checkbox-circle-line fs-18 text-success"></i>
                </span>
              </div>
              <div className="d-flex align-items-center">
                <span className="badge bg-success-transparent me-2">
                  <i className="ri-arrow-up-s-line me-1"></i>66.7%
                </span>
                <span className="text-muted fs-12">occupancy rate</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12">
          <div className="card custom-card">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                  <span className="d-block mb-1 text-muted fs-13">Check-ins Today</span>
                  <h3 className="fw-semibold mb-0">7</h3>
                </div>
                <span className="avatar avatar-md bg-warning-transparent rounded-circle">
                  <i className="ri-login-box-line fs-18 text-warning"></i>
                </span>
              </div>
              <div className="d-flex align-items-center">
                <span className="badge bg-warning-transparent me-2">
                  <i className="ri-arrow-down-s-line me-1"></i>3%
                </span>
                <span className="text-muted fs-12">vs yesterday</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12">
          <div className="card custom-card">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                  <span className="d-block mb-1 text-muted fs-13">Revenue (Month)</span>
                  <h3 className="fw-semibold mb-0">Rp 84,5jt</h3>
                </div>
                <span className="avatar avatar-md bg-info-transparent rounded-circle">
                  <i className="ri-money-dollar-circle-line fs-18 text-info"></i>
                </span>
              </div>
              <div className="d-flex align-items-center">
                <span className="badge bg-success-transparent me-2">
                  <i className="ri-arrow-up-s-line me-1"></i>12%
                </span>
                <span className="text-muted fs-12">vs last month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="row">
        <div className="col-12">
          <div className="card custom-card">
            <div className="card-header">
              <h3 className="card-title">Recent Reservations</h3>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Guest Name</th>
                      <th>Room</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>001</td>
                      <td>Ahmad Fauzi</td>
                      <td>101 - Deluxe</td>
                      <td>20 May 2026</td>
                      <td>23 May 2026</td>
                      <td><span className="badge bg-success-transparent text-success">Confirmed</span></td>
                    </tr>
                    <tr>
                      <td>002</td>
                      <td>Siti Rahayu</td>
                      <td>205 - Suite</td>
                      <td>20 May 2026</td>
                      <td>22 May 2026</td>
                      <td><span className="badge bg-warning-transparent text-warning">Pending</span></td>
                    </tr>
                    <tr>
                      <td>003</td>
                      <td>Budi Santoso</td>
                      <td>310 - Standard</td>
                      <td>21 May 2026</td>
                      <td>24 May 2026</td>
                      <td><span className="badge bg-primary-transparent text-primary">Checked In</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
