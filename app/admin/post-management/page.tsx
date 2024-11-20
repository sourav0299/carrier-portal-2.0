"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../../firebase'
import toast, { Toaster } from 'react-hot-toast'

interface Job {
  id: string;
  jobTitle: string;
  shortDesciption: string;
  ctc: string;
}

const PostManagement = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!auth) {
      console.error('Firebase auth is not initialized');
      router.push('/');
      return;
    }

    const allowedEmails = ['sourav2000kumar07@gmail.com', 'divyankithub@gmail.com'];
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (!user || !allowedEmails.includes(user.email || '')) {
        router.push('/')
      } else {
        fetchJobs()
      }
    })

    return () => unsubscribe()
  }, [router])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs);
      } else {
        throw new Error(data.error || 'Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    console.log('Attempting to delete job with id:', id);
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete job');
      }
  
      const data = await response.json();
      setJobs(jobs.filter(job => job.id !== id));
      toast.success(data.message || 'Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete job');
    }
  };

  if (loading) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Job Management</h1>
      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">Title - {job.jobTitle}</h2>
              <p className="mt-2">Description - {job.shortDesciption}</p>
              <p className="mt-2">Salary - {job.ctc}</p>
              <button
                onClick={() => handleDelete(job.id)}
                className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PostManagement