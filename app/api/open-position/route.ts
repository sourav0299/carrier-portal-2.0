import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("career_portal");
    const jobs = await db.collection("jobs").find({}, { projection: { jobTitle: 1 } }).toArray();

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching job titles:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch job titles' }, { status: 500 });
  }
}
