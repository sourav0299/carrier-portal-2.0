import clientPromise from '../lib/mongodb'
import { ObjectId } from 'mongodb'

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

export async function getJobById(id: string) { 
  const client = await clientPromise
  const db = client.db("career_portal")
  const job = await db.collection("jobs").findOne({ _id: new ObjectId(id) })
  
  if (job) {
    return {
      id: job._id.toString(),
      jobTitle: job.jobTitle,
      location: job.location,
      date: job.date,
      exp: job.exp,
      jobType: job.jobType,
      ctc: job.ctc,
      shortDesciption: job.shortDesciption,
      positionDesciption: job.positionDesciption,
      companyDesciption: job.companyDesciption,
      companyCulture: job.companyCulture,
      Benefits: job.Benefits,
      responsibilty: job.responsibilty,
      workType: job.workType,
      Tags: job.Tags,
    }
  }
  return null
}