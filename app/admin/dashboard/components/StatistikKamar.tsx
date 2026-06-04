import { query } from "@/config/database";

interface data {
  jenis_bed: string;
  total: number;
  terisi: number;
}

export default async function StatistikKamar() {
  const data = await fetchAvailKamar();

  const colors = ["primary", "success", "warning", "danger", "info"];

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-4">
        <h5 className="mb-4">Occupancy per Tipe Kamar</h5>

        {data.map((room, i) => {
          const percentage = Math.round((room.terisi / room.total) * 100);
          const color = colors[i % colors.length];

          return (
            <div key={room.jenis_bed} className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-medium">{room.jenis_bed}</span>

                <span className="text-muted">
                  <strong>{percentage}%</strong> terisi · {room.terisi}/
                  {room.total} kamar
                </span>
              </div>

              <div
                className="progress"
                style={{
                  height: "10px",
                }}
              >
                <div
                  className={`progress-bar bg-${color}`}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const fetchAvailKamar = async () => {
  try {
    const data = await query<data[]>(
      `SELECT jenis_bed, COUNT(*) AS total, SUM(is_occupied) AS terisi
      FROM (
          SELECT k.id, k.jenis_bed,
              EXISTS(
                  SELECT 1
                  FROM booking_detail bd
                  JOIN booking b ON b.id = bd.booking_id
                  WHERE bd.kamar_id = k.id
                    AND b.status IN ('confirmed', 'checked_in')
                    AND bd.checkin <= CURDATE()
                    AND bd.checkout > CURDATE()
              ) AS is_occupied
          FROM kamar k
      ) rooms
      GROUP BY jenis_bed;`,
    );

    return data;
  } catch {
    return [];
  }
};
