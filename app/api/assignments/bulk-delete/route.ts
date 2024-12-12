import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request: Request) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty array of ids' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("carrierportal");

    const result = await db.collection("assignments").deleteMany({
      _id: { $in: ids.map(id => new ObjectId(id)) }
    });

    if (result.deletedCount > 0) {
      return NextResponse.json({ success: true, deletedCount: result.deletedCount });
    } else {
      return NextResponse.json({ error: 'No assignments found to delete' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting assignments:', error);
    return NextResponse.json({ error: 'Error deleting assignments' }, { status: 500 });
  }
}