import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM trash_catalog ORDER BY required_unlock_depth ASC`;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Database sonar failure' }, { status: 500 });
  }
}