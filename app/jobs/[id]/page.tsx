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
  positionDesciption: string;
  companyDesciption: string;
  companyCulture: string;
  Benefits: string;
  responsibilty: string;
  workType: string;
  Tags: string[];
}

const JobDescriptionPage: React.FC = () => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJob = async () => {
      const id = window.location.pathname.split('/').pop();
      try {
        const response = await fetch(`/api/jobs?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const data = await response.json();
        if (data.success) {
          setJob(data.job);
        } else {
          throw new Error(data.error || 'Failed to fetch job details');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => router.push('/')}
        className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Back to Jobs
      </button>
      <h1 className="text-3xl font-bold mb-6">{job.jobTitle}</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Job Details</h2>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Experience:</strong> {job.exp}</p>
          <p><strong>Job Type:</strong> {job.jobType}</p>
          <p><strong>CTC:</strong> {job.ctc}</p>
          <p><strong>Work Type:</strong> {job.workType}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Job Description</h2>
          <p>{job.shortDesciption}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Position Description</h2>
          <p>{job.positionDesciption}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Company Description</h2>
          <p>{job.companyDesciption}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Company Culture</h2>
          <p>{job.companyCulture}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Benefits</h2>
          <p>{job.Benefits}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Responsibilities</h2>
          <p>{job.responsibilty}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {job.Tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionPage;