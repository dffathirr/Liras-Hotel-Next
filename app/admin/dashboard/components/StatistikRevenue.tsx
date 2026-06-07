import { query } from "@/config/database";
import Chart from "./Chart";

export const dynamic = "force-dynamic";

export default async function StatistikRevenue() {
  const data = await fetchRevenue();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const revenueMap = new Map(
    data.map((item) => [item.bulan, Number(item.revenue)]),
  );

  const categories = months;

  const series = [
    {
      name: "Revenue",
      data: months.map((month) => revenueMap.get(month) ?? 0),
    },
  ];

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="mb-4">
          <h5 className="fw-semibold mb-1">Revenue Bulanan</h5>
        </div>

        <Chart type="column" categories={categories} series={series} />
      </div>
    </div>
  );
}

type RevenueChart = {
  bulan: string;
  revenue: number | string;
};

const fetchRevenue = async () => {
  try {
    const data = await query<RevenueChart[]>(
      `
      SELECT
          DATE_FORMAT(b.created_at, '%b') AS bulan,
          COALESCE(SUM(p.total), 0) AS revenue
      FROM pembayaran p
      JOIN booking b
          ON b.id = p.booking_id
      WHERE p.status = 'paid'
      AND YEAR(b.created_at) = YEAR(CURDATE())
      GROUP BY
          MONTH(b.created_at),
          DATE_FORMAT(b.created_at, '%b')
      ORDER BY MONTH(b.created_at)
      `,
    );

    return data;
  } catch {
    return [];
  }
};
