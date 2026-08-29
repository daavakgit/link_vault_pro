import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

export async function POST() {
  const cookie = removeAuthCookie();
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.set(cookie.name, cookie.value, cookie);
  return response;
}
