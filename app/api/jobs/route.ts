import clientPromise from '../../lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("career_portal");
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

    const result = await db.collection("jobs").insertOne({
      jobTitle,
      location,
      date: new Date(),
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
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error adding job:', error);
    return NextResponse.json({ success: false, error: 'Failed to add job' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("career_portal");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const job = await db.collection("jobs").findOne({ _id: new ObjectId(id) });
      if (job) {
        return NextResponse.json({ success: true, job: { ...job, id: job._id.toString() } });
      } else {
        return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
      }
    } else {
      const jobs = await db.collection("jobs").find({}).toArray();
      const formattedJobs = jobs.map(job => ({
        ...job,
        id: job._id.toString(),
      }));
      return NextResponse.json({ success: true, jobs: formattedJobs });
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch jobs' }, { status: 500 });
  }
}