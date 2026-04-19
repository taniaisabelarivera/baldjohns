import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false // This is required for Neon/Vercel handshake
    }
  });

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM trash_catalog ORDER BY required_unlock_depth ASC');
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error("SONAR CRASH:", error.message);
    return NextResponse.json({ 
      error: "Database sonar failure", 
      details: error.message 
    }, { status: 500 });
  } finally {
    await client.end();
  }
}