import { query } from "@/config/database";
import { formatPrice } from "@/helpers/site";

export default async function Widgets() {
  const [totalKamar, totalBooking, totalCustomer, totalRevenue] =
    await Promise.all([
      fetchTotalKamar(),
      fetchTotalBooking(),
      fetchTotalCustomer(),
      fetchTotalRevenue(),
    ]);

  return (
    <div className="row g-3 mb-4">
      <div className="col-md-3">
        <div className="card border-0 shadow-sm overflow-hidden position-relative">
          <div className="card-body">
            <small className="text-muted">Total Kamar</small>
            <h2 className="fw-semibold mt-2">{totalKamar}</h2>
            <i
              className="fas fa-bed text-success position-absolute"
              style={{
                right: "20px",
                bottom: "10px",
                fontSize: "60px",
                opacity: 0.15,
              }}
            ></i>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border-0 shadow-sm overflow-hidden position-relative">
          <div className="card-body">
            <small className="text-muted">Total Booking</small>
            <h2 className="fw-semibold mt-2">{totalBooking}</h2>
            <i
              className="fas fa-calendar-check text-success position-absolute"
              style={{
                right: "20px",
                bottom: "10px",
                fontSize: "60px",
                opacity: 0.15,
              }}
            ></i>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border-0 shadow-sm overflow-hidden position-relative">
          <div className="card-body">
            <small className="text-muted">Total Customer</small>
            <h2 className="fw-semibold mt-2">{totalCustomer}</h2>
            <i
              className="fas fa-user text-success position-absolute"
              style={{
                right: "20px",
                bottom: "10px",
                fontSize: "60px",
                opacity: 0.15,
              }}
            ></i>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border-0 shadow-sm overflow-hidden position-relative">
          <div className="card-body">
            <small className="text-muted">Total Revenue</small>
            <h2 className="fw-semibold mt-2">{formatPrice(totalRevenue)}</h2>
            <i
              className="fas fa-money-bill-wave text-success position-absolute"
              style={{
                right: "20px",
                bottom: "10px",
                fontSize: "60px",
                opacity: 0.15,
              }}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
}

const fetchTotalKamar = async () => {
  try {
    const data = await query<[{ total: number }]>(
      `SELECT COUNT(*) AS total FROM kamar`,
    );

    return data[0].total;
  } catch {
    return 0;
  }
};

const fetchTotalBooking = async () => {
  try {
    const data = await query<[{ total: number }]>(
      `SELECT COUNT(*) AS total FROM booking`,
    );

    return data[0].total;
  } catch {
    return 0;
  }
};

const fetchTotalCustomer = async () => {
  try {
    const data = await query<[{ total: number }]>(
      `SELECT COUNT(*) AS total FROM customer`,
    );

    return data[0].total;
  } catch {
    return 0;
  }
};

const fetchTotalRevenue = async () => {
  try {
    const data = await query<[{ total: number }]>(
      `SELECT SUM(total) as total FROM pembayaran WHERE status = 'paid'`,
    );

    return data[0].total;
  } catch {
    return 0;
  }
};
