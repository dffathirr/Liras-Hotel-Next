import { query } from "@/config/database";
import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2/promise";

export async function GET() {
  try {
    const kamar = await query(`
      SELECT k.*,
        EXISTS(
          SELECT 1 FROM booking_detail bd
          JOIN booking b ON b.id = bd.booking_id
          WHERE bd.kamar_id = k.id
            AND b.status IN ('confirmed', 'checked_in')
            AND bd.checkin  <= CURDATE()
            AND bd.checkout >  CURDATE()
        ) AS is_occupied
      FROM kamar k
      ORDER BY k.no_kamar ASC
    `);
    return NextResponse.json(kamar);
  } catch (error) {
    console.error("[GET] /api/kamar", error);
    return NextResponse.json(
      { message: "Gagal mengambil data kamar" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, jenis_bed, no_kamar, size, harga, max_tamu, description } =
      body;

    if (!nama || !jenis_bed || !no_kamar || !harga || !max_tamu) {
      return NextResponse.json(
        { message: "Nama, jenis bed, no. kamar, harga, dan max tamu wajib diisi" },
        { status: 400 },
      );
    }

    const result = await query<ResultSetHeader>(
      `INSERT INTO kamar (nama, jenis_bed, no_kamar, size, harga, max_tamu, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nama,
        jenis_bed,
        no_kamar,
        size || null,
        Number(harga),
        Number(max_tamu),
        description || null,
      ],
    );
    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { message: "No. kamar sudah digunakan" },
        { status: 409 },
      );
    }
    console.error("[POST] /api/kamar", error);
    return NextResponse.json(
      { message: "Gagal menambah kamar" },
      { status: 500 },
    );
  }
}
