import pool from "@/config/database";
import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2/promise";

const VALID_STATUSES = ["pending", "confirmed", "checked_in", "checked_out", "cancelled"] as const;
type BookingStatus = (typeof VALID_STATUSES)[number];

// Pembayaran status to set when booking status changes
const PEMBAYARAN_STATUS_MAP: Partial<Record<BookingStatus, string>> = {
  confirmed: "paid",
  cancelled: "cancelled",
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const bookingId = Number(id);

  if (!bookingId || isNaN(bookingId)) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
  }

  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Body tidak valid" }, { status: 400 });
  }

  const { status } = body;
  if (!status || !(VALID_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json(
      { message: `Status tidak valid. Gunakan: ${VALID_STATUSES.join(", ")}` },
      { status: 422 },
    );
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.execute<ResultSetHeader>(
      "UPDATE booking SET status = ? WHERE id = ?",
      [status, bookingId],
    );

    if (result.affectedRows === 0) {
      await conn.rollback();
      return NextResponse.json({ message: "Booking tidak ditemukan" }, { status: 404 });
    }

    // Sync pembayaran status jika perlu
    const pembayaranStatus = PEMBAYARAN_STATUS_MAP[status as BookingStatus];
    if (pembayaranStatus) {
      await conn.execute(
        "UPDATE pembayaran SET status = ? WHERE booking_id = ?",
        [pembayaranStatus, bookingId],
      );
    }

    await conn.commit();
    return NextResponse.json({ bookingId, status });
  } catch (error) {
    await conn.rollback();
    console.error("[PATCH] /api/booking/[id]", error);
    return NextResponse.json(
      { message: "Gagal memperbarui status booking" },
      { status: 500 },
    );
  } finally {
    conn.release();
  }
}
