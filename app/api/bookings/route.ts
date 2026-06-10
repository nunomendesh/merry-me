import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');
  const name = searchParams.get('name');

  let query = supabaseAdmin.from('bookings').select('*').order('created_at', { ascending: false });

  if (phone && name) {
    query = query.ilike('phone', phone).ilike('name', name);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, service, doctor, date, time } = body;

  if (!name || !phone || !service) {
    return NextResponse.json({ error: 'name, phone, service are required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from('bookings').insert([{
    name, phone, service,
    doctor: doctor || null,
    date: date || 'Связь по телефону',
    time: time || 'В ближайшее время',
    status: 'pending',
  }]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
