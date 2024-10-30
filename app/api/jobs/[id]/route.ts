import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('Received delete request for job id:', params.id);
  try {
    const client = await clientPromise;
    const db = client.db("career_portal");
    const { id } = params;
    const allJobs = await db.collection("jobs").find({}).toArray();

    const result = await db.collection("jobs").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}