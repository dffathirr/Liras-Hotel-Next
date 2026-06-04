import { query } from "@/config/database";
import Chart from "./Chart";

interface status {
  status_booking: string;
  total: number;
}

export default async function StatistikBooking() {
  const data = await fetchStatusBooking();

  const categories = data.map((item) => item.status_booking);

  const series = [
    {
      name: "Booking",
      data: data.map((item) => item.total),
    },
  ];

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="mb-4">
          <h5 className="fw-semibold mb-1">Status Booking</h5>
        </div>

        <Chart type="column" categories={categories} series={series} />
      </div>
    </div>
  );
}

const fetchStatusBooking = async () => {
  try {
    const data = await query<status[]>(
      ` SELECT
            'Success' AS status_booking,
            COUNT(*) AS total
        FROM booking
        WHERE status IN ('confirmed', 'checked_in', 'checked_out')
        AND MONTH(created_at) = MONTH(CURDATE())
        AND YEAR(created_at) = YEAR(CURDATE())

        UNION ALL

        SELECT
            'Cancelled' AS status_booking,
            COUNT(*) AS total
        FROM booking
        WHERE status = 'cancelled'
        AND MONTH(created_at) = MONTH(CURDATE())
        AND YEAR(created_at) = YEAR(CURDATE());`,
    );

    return data;
  } catch {
    return [];
  }
};
