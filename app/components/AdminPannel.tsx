"use client";

import { useState } from 'react';
import JobCard from '../components/JobCard';
import toast from 'react-hot-toast';

interface Job {
  id?: string;
  title: string;
  description: string;
salary: string;
}

const AdminPanel: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newJob, setNewJob] = useState<Job>({ title: '', description: '', salary: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewJob(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJob),
      });

      if (!response.ok) {
        throw new Error('Failed to add job');
      }

      const result = await response.json();
        if (result.success) {
        toast.success('Job added successfully');
        setJobs(prev => [...prev, { ...newJob, id: result.id }]);
        setNewJob({ title: '', description: '', salary: '' });
      } else {
        throw new Error(result.error || 'Failed to add job');
      }
    } catch (error) {
      toast.error(`Failed to add job: ${error} `);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newJob.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2">Job Description</label>
          <textarea
            id="description"
            name="description"
            value={newJob.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="salary" className="block mb-2">Salary</label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={newJob.salary}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Job
        </button>
      </form>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job, index) => (
                  <JobCard 
                    key={job.id || index} 
                    id={job.id || `temp-${index}`}
                    title={job.title}
                    description={job.description}
                    salary={job.salary}
                  />
                ))}
              </div>
    </div>
  );
};

export default AdminPanel;