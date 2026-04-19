import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get('image');
    const targetId = formData.get('targetId') as string; // Fixes the Primitive error

    if (!targetId) {
      return NextResponse.json({ error: 'Missing Target ID' }, { status: 400 });
    }

    // 1. Get the description from our new trash_catalog column
    const { rows } = await sql`
      SELECT item_name, description 
      FROM trash_catalog 
      WHERE id = ${targetId}
    `;
    
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Item not found in sonar database' }, { status: 404 });
    }

    // 2. Send the original formData (image + targetId) to Human Delta
    // We also include the description in the headers or body if your specific AI needs it
    const deltaResponse = await fetch('https://api.humandelta.ai/v1/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUMAN_DELTA_API_KEY}`,
      },
      body: formData, 
    });

    const result = await deltaResponse.json();

    // 3. Set the threshold to 0.4 for the demo (very forgiving)
    if (result.match_confidence > 0.4) {
      return NextResponse.json({ verified: true });
    }
    
    return NextResponse.json({ 
      verified: false, 
      message: `AI Confidence (${Math.round(result.match_confidence * 100)}%) too low for verification.` 
    }, { status: 400 });

  } catch (error) {
    console.error("VERIFY_ERROR:", error);
    return NextResponse.json({ error: 'Sensor Malfunction' }, { status: 500 });
  }
}