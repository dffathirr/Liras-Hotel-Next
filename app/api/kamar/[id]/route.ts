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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) {
    return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { nama, jenis_bed, no_kamar, size, harga, max_tamu, description } = body;

    if (!nama || !jenis_bed || !no_kamar || !harga || !max_tamu) {
      return NextResponse.json(
        { message: 'Nama, jenis bed, no. kamar, harga, dan max tamu wajib diisi' },
        { status: 400 },
      );
    }

    await query(
      `UPDATE kamar SET nama=?, jenis_bed=?, no_kamar=?, size=?, harga=?, max_tamu=?, description=?
       WHERE id=?`,
      [nama, jenis_bed, no_kamar, size || null, Number(harga), Number(max_tamu), description || null, numId],
    );
    return NextResponse.json({ message: 'OK' });
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: 'No. kamar sudah digunakan' }, { status: 409 });
    }
    console.error('[PATCH] /api/kamar/[id]', error);
    return NextResponse.json({ message: 'Gagal memperbarui kamar' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) {
    return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });
  }

  try {
    await query('DELETE FROM kamar WHERE id = ?', [numId]);
    return NextResponse.json({ message: 'OK' });
  } catch (error) {
    console.error('[DELETE] /api/kamar/[id]', error);
    return NextResponse.json({ message: 'Gagal menghapus kamar' }, { status: 500 });
  }
}
