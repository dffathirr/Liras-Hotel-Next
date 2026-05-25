import { query } from "@/config/database";
import { NextResponse } from "next/server";

type KamarRow = {
  id: number;
  no_kamar: string | null;
  jenis_bed: string;
  harga: number;
  max_tamu: number;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const checkin = searchParams.get("checkin");
  const checkout = searchParams.get("checkout");
  const jenis_bed = searchParams.get("jenis_bed");

  if (!checkin || !checkout) {
    return NextResponse.json(
      { message: "checkin dan checkout wajib diisi" },
      { status: 400 },
    );
  }

  if (new Date(checkin) >= new Date(checkout)) {
    return NextResponse.json(
      { message: "checkout harus setelah checkin" },
      { status: 400 },
    );
  }

  try {
    // Rooms are UNAVAILABLE if there's an overlapping booking_detail
    // Overlap: bd.checkin < req_checkout AND bd.checkout > req_checkin
    const params: string[] = [checkout, checkin];
    let jenisFilter = "";
    if (jenis_bed) {
      jenisFilter = "AND k.jenis_bed = ?";
      params.push(jenis_bed);
    }

    const rows = await query<KamarRow[]>(
      `SELECT k.id, k.no_kamar, k.jenis_bed, k.harga, k.max_tamu
       FROM kamar k
       WHERE k.id NOT IN (
         SELECT bd.kamar_id
         FROM booking_detail bd
         JOIN booking b ON b.id = bd.booking_id
         WHERE b.status != 'cancelled'
           AND bd.checkin  < ?
           AND bd.checkout > ?
       )
       ${jenisFilter}
       ORDER BY k.no_kamar ASC`,
      params,
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[GET] /api/kamar/available", error);
    return NextResponse.json(
      { message: "Gagal mengambil data kamar tersedia" },
      { status: 500 },
    );
  }
}
