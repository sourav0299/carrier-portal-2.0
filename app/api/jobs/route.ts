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

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("career_portal");
    
    const jobs = await db.collection("jobs").find({}).toArray();
    
    const formattedJobs = jobs.map(job => ({
      id: job._id.toString(),
      title: job.title,
      description: job.description,
      salary: job.salary,
      createdAt: job.createdAt
    }));

    return NextResponse.json({ success: true, jobs: formattedJobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch jobs' }, { status: 500 });
  }
}