import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get('image');
    const targetId = formData.get('targetId');

    // Send to Human Delta
    const response = await fetch('https://api.humandelta.ai/v1/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUMAN_DELTA_API_KEY}`,
      },
      body: formData, // Passing the image through
    });

    const result = await response.json();

    // Check if Human Delta confirms it matches the trash item
    if (result.match_confidence > 0.8) {
      return NextResponse.json({ verified: true });
    }
    
    return NextResponse.json({ verified: false, message: "Object mismatch" }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: 'Sensor Malfunction' }, { status: 500 });
  }
}