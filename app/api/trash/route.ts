import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  // Directly passing the URL from your env file to the client
  const client = createClient({
    connectionString: process.env.POSTGRES_URL 
  });

  try {
    await client.connect();
    
    const { rows } = await client.query(`
      SELECT 
        t.id, 
        t.zone_name, 
        t.item_name, 
        t.impact_fact, 
        t.required_unlock_depth, 
        t.image_url,
        m.common_name AS animal_name,
        m.image_url AS animal_image_url
      FROM trash_catalog t
      LEFT JOIN marine_life m ON t.id = m.trash_id
      ORDER BY t.required_unlock_depth ASC;
    `);
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    // End the connection so Neon doesn't throttle you
    await client.end();
  }
}