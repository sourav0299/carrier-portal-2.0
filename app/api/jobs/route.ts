import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("career_portal");
    const { title, description, salary } = await request.json();

    const result = await db.collection("jobs").insertOne({
      title,
      description,
      salary,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error adding job:', error);
    return NextResponse.json({ success: false, error: 'Failed to add job' }, { status: 500 });
  }
}