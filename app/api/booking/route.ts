import pool, { query } from "@/config/database";
import { NextResponse } from "next/server";
import type { PoolConnection, ResultSetHeader } from "mysql2/promise";

type BookingRow = {
  id: number;
  customer_id: number;
  user_id: number | null;
  status: string;
  created_at: string;
  customer_nama: string;
  customer_no_telp: string;
  kamar_id: number;
  no_kamar: string;
  jenis_bed: string;
  checkin: string;
  checkout: string;
  jml_tamu: number;
  harga: number;
};

export async function GET() {
  try {
    const rows = await query<BookingRow[]>(`
      SELECT
        b.id, b.status, b.created_at,
        c.nama  AS customer_nama,
        c.no_telp AS customer_no_telp,
        bd.kamar_id, bd.checkin, bd.checkout, bd.jml_tamu, bd.harga,
        k.no_kamar, k.jenis_bed
      FROM booking b
      JOIN customer      c  ON c.id  = b.customer_id
      JOIN booking_detail bd ON bd.booking_id = b.id
      JOIN kamar         k  ON k.id  = bd.kamar_id
      ORDER BY b.created_at DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[GET] /api/booking", error);
    return NextResponse.json(
      { message: "Gagal mengambil data booking" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  let body: {
    kamar_id: number;
    checkin: string;
    checkout: string;
    jml_tamu: number;
    nama: string;
    gender: string;
    no_telp: string;
    alamat: string;
    metode_pembayaran: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Body tidak valid" }, { status: 400 });
  }

  const {
    kamar_id,
    checkin,
    checkout,
    jml_tamu,
    nama,
    gender,
    no_telp,
    alamat,
    metode_pembayaran,
  } = body;

  if (
    !kamar_id ||
    !checkin ||
    !checkout ||
    !jml_tamu ||
    !metode_pembayaran ||
    !nama ||
    !gender ||
    !no_telp
  ) {
    return NextResponse.json(
      { message: "Semua field wajib diisi" },
      { status: 422 },
    );
  }

  // Hitung total harga (harga/malam × jumlah malam)
  type KamarRow = { harga: number; max_tamu: number };
  const kamarRows = await query<KamarRow[]>(
    "SELECT harga, max_tamu FROM kamar WHERE id = ?",
    [kamar_id],
  );
  if (!kamarRows.length) {
    return NextResponse.json(
      { message: "Kamar tidak ditemukan" },
      { status: 404 },
    );
  }
  const kamar = kamarRows[0];

  if (jml_tamu > kamar.max_tamu) {
    return NextResponse.json(
      { message: `Kamar ini hanya untuk maksimal ${kamar.max_tamu} tamu` },
      { status: 422 },
    );
  }

  type ActiveUser = { id: number; email: string };
  const activeUserRows = await query<ActiveUser[]>(
    "SELECT id, email FROM user WHERE isActive = ? LIMIT 1",
    [1],
  );
  const userId = activeUserRows[0]?.id ?? 1;

  const msPerDay = 1000 * 60 * 60 * 24;
  const nights = Math.ceil(
    (new Date(checkout).getTime() - new Date(checkin).getTime()) / msPerDay,
  );
  if (nights < 1) {
    return NextResponse.json(
      { message: "Tanggal checkout harus setelah checkin" },
      { status: 422 },
    );
  }
  const totalHarga = kamar.harga * nights;

  let conn: PoolConnection | null = null;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // 1. Simpan customer
    const [custResult] = await conn.execute<ResultSetHeader>(
      "INSERT INTO customer (nama, gender, alamat, no_telp) VALUES (?, ?, ?, ?)",
      [nama, gender, alamat ?? "", no_telp],
    );
    const customerId = custResult.insertId;

    // 2. Buat booking
    const [bookingResult] = await conn.execute<ResultSetHeader>(
      "INSERT INTO booking (customer_id, user_id, status, created_at) VALUES (?, ?, ?, NOW())",
      [customerId, userId, "pending"],
    );
    const bookingId = bookingResult.insertId;

    // 3. Booking detail
    await conn.execute(
      "INSERT INTO booking_detail (booking_id, kamar_id, checkin, checkout, jml_tamu, harga) VALUES (?, ?, ?, ?, ?, ?)",
      [bookingId, kamar_id, checkin, checkout, jml_tamu, totalHarga],
    );

    // 4. Pembayaran
    await conn.execute(
      "INSERT INTO pembayaran (booking_id, jenis_pembayaran, status, total) VALUES (?, ?, ?, ?)",
      [bookingId, metode_pembayaran, "pending", totalHarga],
    );

    await conn.commit();

    return NextResponse.json(
      { bookingId, totalHarga, nights },
      { status: 201 },
    );
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("[POST] /api/booking", error);
    return NextResponse.json(
      { message: "Gagal membuat booking" },
      { status: 500 },
    );
  } finally {
    if (conn) conn.release();
  }
}
