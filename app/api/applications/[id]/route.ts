import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('Received delete request for user id:', params.id);
  try {
    const client = await clientPromise;
    const db = client.db("carrierportal");
    const { id } = params;

    const result = await db.collection("applications").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}