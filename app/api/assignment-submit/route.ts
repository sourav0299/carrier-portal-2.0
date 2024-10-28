import { NextResponse } from 'next/server';
import { getDatabase } from '../../lib/mongodb';

export async function POST(request: Request) {
  try {
    const { name, email, phone, position, figmaLink, googleDriveLink } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection('assignments');

    const result = await collection.insertOne({
      name,
      email,
        phone,
      position,
      figmaLink,
      googleDriveLink,
      submittedAt: new Date()
    });

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}