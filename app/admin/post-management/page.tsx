"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../../firebase'
import toast, { Toaster } from 'react-hot-toast'
import Loader from '@/app/components/Loader'

interface Job {
  id: string;
  jobTitle: string;
  shortDesciption: string;
  ctc: string;
}

const PostManagement = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<string | null>(null)
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

  const confirmDelete = (id: string) => {
    setJobToDelete(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      const response = await fetch(`/api/jobs/${jobToDelete}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete job');
      }
  
      const data = await response.json();
      setJobs(jobs.filter(job => job.id !== jobToDelete));
      toast.success(data.message || 'Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete job');
    } finally {
      setShowModal(false);
      setJobToDelete(null);
    }
  };

  const handleEdit = (id: string) => { 
    router.push(`/admin/job/edit/${id}`);
  }

  if (loading) return <Loader/>

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
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(job.id)}
                  className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(job.id)}
                  className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this job?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostManagement