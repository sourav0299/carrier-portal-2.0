"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Job {
  id: string;
  jobTitle: string;
  location: string;
  exp: string;
  jobType: string;
  ctc: string;
  shortDesciption: string;
  workType: string;
  Tags: string[];
}

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Open Positions</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div 
            key={job.id} 
            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
            onClick={() => router.push(`/jobs/${job.id}`)}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{job.jobTitle}</h2>
              <p className="text-gray-600 mb-4">{job.shortDesciption}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {job.location}
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {job.workType}
                </span>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {job.exp} years exp
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">{job.ctc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;