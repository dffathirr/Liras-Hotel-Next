import mysql, { type ExecuteValues } from 'mysql2/promise';

const pool = mysql.createPool({
  host:               process.env.DB_HOST     ?? 'localhost',
  port:               Number(process.env.DB_PORT ?? 3306),
  user:               process.env.DB_USER     ?? 'root',
  password:           process.env.DB_PASSWORD ?? '',
  database:           process.env.DB_NAME     ?? 'liras_hotel',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           '+07:00',
});

export default pool;

/**
 * Helper — jalankan query dengan typed result.
 *
 * Contoh:
 *   const rows = await query<Booking[]>('SELECT * FROM bookings WHERE id = ?', [id]);
 */
export async function query<T = unknown>(sql: string, params?: ExecuteValues): Promise<T> {
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}
