import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (
    !adminUsername || !adminPassword ||
    username !== adminUsername ||
    password !== adminPassword
  ) {
    return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set('admin_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return NextResponse.json({ success: true });
}
