import { query } from '@/config/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const kamar = await query('SELECT * FROM kamar');
    return NextResponse.json(kamar);
  } catch (error) {
    console.error('[GET] /api/kamar', error);
    return NextResponse.json({ message: 'Gagal mengambil data kamar' }, { status: 500 });
  }
}
