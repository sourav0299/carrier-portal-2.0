import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db("career_portal");
    const jobsCollection = db.collection('jobs');

    const result = await jobsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { viewCount: 1 } }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ success: true, message: 'View count incremented' });
    } else {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}