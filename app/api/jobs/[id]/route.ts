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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("career_portal");
    const { id } = params;

    console.log('Job ID from request:', id);

    if (!id) {
      return NextResponse.json({ success: false, error: 'Job ID is required' }, { status: 400 });
    }

    const {
      jobTitle,
      location,
      exp,
      jobType,
      ctc,
      shortDesciption,
      positionDesciption,
      companyDesciption,
      companyCulture,
      Benefits,
      responsibilty,
      workType,
      Tags,
    } = await request.json();

    const result = await db.collection("jobs").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          jobTitle,
          location,
          exp,
          jobType,
          ctc,
          shortDesciption,
          positionDesciption,
          companyDesciption,
          companyCulture,
          Benefits,
          responsibilty,
          workType,
          Tags,
        },
      }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error editing job:', error);
    return NextResponse.json({ success: false, error: 'Failed to edit job' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("career_portal");
    console.log('Received job ID:', params.id);
    const job = await db.collection('jobs').findOne({ _id: new ObjectId(params.id) });

    if (!job) {
      console.log('Job not found for ID:', params.id);
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    console.log('Found job:', job);

    const jobWithStringId = { ...job, id: job._id.toString(), _id: job._id.toString() };

    return NextResponse.json(jobWithStringId);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}