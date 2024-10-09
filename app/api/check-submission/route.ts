import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("carrierportal");
    const submission = await db.collection("assignments").findOne({ email });

    return NextResponse.json({ exists: !!submission });
  } catch (error) {
    console.error('Error checking submission:', error);
    return NextResponse.json({ error: 'Error checking submission' }, { status: 500 });
  }
}