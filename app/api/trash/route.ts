import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  // Use the connection string exactly as it appears in your Vercel env
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false 
    },
    connectionTimeoutMillis: 5000, // Don't hang forever
  });

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM trash_catalog ORDER BY required_unlock_depth ASC');
    return NextResponse.json(result.rows);
  } catch (error: any) {
    // THIS WILL SHOW UP IN YOUR TERMINAL
    console.error("SONAR DATABASE ERROR:", error.message); 
    return NextResponse.json({ 
      error: "Database sonar failure", 
      details: error.message 
    }, { status: 500 });
  } finally {
    await client.end();
  }
}