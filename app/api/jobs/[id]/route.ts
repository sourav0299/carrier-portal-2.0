import { NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const { id } = params;

    const result = await db.collection('jobs').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}