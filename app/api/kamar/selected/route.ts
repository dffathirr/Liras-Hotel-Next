import { query } from "@/config/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const kamar = await query(`
      SELECT
        MIN(id)              AS id,
        ANY_VALUE(nama)      AS nama,
        jenis_bed,
        ANY_VALUE(size)      AS size,
        ANY_VALUE(harga)     AS harga,
        ANY_VALUE(max_tamu)  AS max_tamu,
        ANY_VALUE(description) AS description
      FROM kamar
      GROUP BY jenis_bed
      ORDER BY MIN(id) ASC
    `);
    return NextResponse.json(kamar);
  } catch (error) {
    console.error("[GET] /api/kamar/selected", error);
    return NextResponse.json(
      { message: "Gagal mengambil data kamar" },
      { status: 500 },
    );
  }
}