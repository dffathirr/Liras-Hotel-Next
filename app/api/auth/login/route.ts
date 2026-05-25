import { NextResponse } from 'next/server';
import { query } from '@/config/database';

type UserRow = { id: number; nama: string };

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password wajib diisi' },
        { status: 400 },
      );
    }

    const rows = await query<UserRow[]>(
      'SELECT id, nama FROM user WHERE email = ? AND password = ? AND isActive = 1',
      [email, password],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'Email atau password salah' },
        { status: 401 },
      );
    }

    const res = NextResponse.json({ ok: true, nama: rows[0].nama });
    res.cookies.set('admin_session', String(rows[0].id), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 8, // 8 jam
      sameSite: 'lax',
    });
    return res;
  } catch {
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 },
    );
  }
}
