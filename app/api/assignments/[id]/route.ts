import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const client = await clientPromise;
    const db = client.db("carrierportal");
    const result = await db.collection("assignments").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json({ error: 'Error deleting assignment' }, { status: 500 });
  }
}