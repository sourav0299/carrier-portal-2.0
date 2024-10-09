import { NextResponse } from 'next/server';
import { getDatabase } from '../../lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection('assignments');

    const assignments = await collection.find({}).toArray();

    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}