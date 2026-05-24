import { query } from '@/config/database';
import { NextResponse } from 'next/server';

type Room = { id: number; jenis_bed: string; harga: number; max_tamu: number };

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) {
    return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });
  }

  try {
    const rows = await query<Room[]>('SELECT * FROM kamar WHERE id = ?', [numId]);
    if (!rows.length) {
      return NextResponse.json({ message: 'Kamar tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('[GET] /api/kamar/[id]', error);
    return NextResponse.json({ message: 'Gagal mengambil data kamar' }, { status: 500 });
  }
}
