import clientPromise from '../lib/mongodb'

export async function getJobs() {
  const client = await clientPromise
  const db = client.db("career_portal")
  const jobs = await db.collection("jobs").find({}).toArray()
  return jobs.map(job => ({
    id: job._id.toString(),
    title: job.title,
    description: job.description,
    salary: job.salary
  }))
}