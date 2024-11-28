'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { auth } from '../../../../firebase';
import { User, onAuthStateChanged } from "firebase/auth";
import toast from 'react-hot-toast';
import Loader from '../../../../components/Loader';

interface Job {
  id?: string;
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

const AdminPanel: React.FC = () => {
  const [job, setJob] = useState<Job>({
    jobTitle: '',
    location: '',
    exp: '',
    jobType: '',
    ctc: '',
    shortDesciption: '',
    positionDesciption: '',
    companyDesciption: '',
    companyCulture: '',
    Benefits: '',
    responsibilty: '',
    workType: '',
    Tags: []
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  useEffect(() => {
    let unsubscribe: () => void;

    const allowedEmails = ['sourav2000kumar07@gmail.com', 'divyankithub@gmail.com']; 
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (!currentUser) {
          router.push('/login');
        } else if (!allowedEmails.includes(currentUser.email || '')) {
          router.push('/');
        } else {
          setUser(currentUser);
          setLoading(false);
        }
      });
    } else {
      console.error('Firebase auth is not initialized');
      router.push('/login');
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    console.log('Job ID:', jobId);
    if (jobId) {
      fetchJobDetails(jobId);
    }
  }, [jobId]);

  const fetchJobDetails = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setJob(data);
      setLoading(false);
    } catch (error) {
      toast.error(`Failed to fetch job details: ${error}`);
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJob(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setJob(prev => ({ ...prev, Tags: tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(job),
      });

      if (response.ok) {
        toast.success('Job updated successfully');
        router.push('/');
      } else {
        throw new Error('Failed to update job');
      }
    } catch (error) {
      toast.error(`Failed to update job: ${error}`);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Job Details</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="jobTitle" className="block mb-2">Job Title</label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={job.jobTitle}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
         <div className="mb-4">
          <label htmlFor="location" className="block mb-2">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={job.location}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="exp" className="block mb-2">Experience</label>
          <input
            type="text"
            id="exp"
            name="exp"
            value={job.exp}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="jobType" className="block mb-2">Job Type</label>
          <input
            type="text"
            id="jobType"
            name="jobType"
            value={job.jobType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="ctc" className="block mb-2">CTC</label>
          <input
            type="text"
            id="ctc"
            name="ctc"
            value={job.ctc}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="shortDesciption" className="block mb-2">Short Description</label>
          <textarea
            id="shortDesciption"
            name="shortDesciption"
            value={job.shortDesciption}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="positionDesciption" className="block mb-2">Position Description</label>
          <textarea
            id="positionDesciption"
            name="positionDesciption"
            value={job.positionDesciption}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="companyDesciption" className="block mb-2">Company Description</label>
          <textarea
            id="companyDesciption"
            name="companyDesciption"
            value={job.companyDesciption}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="companyCulture" className="block mb-2">Company Culture</label>
          <textarea
            id="companyCulture"
            name="companyCulture"
            value={job.companyCulture}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="Benefits" className="block mb-2">Benefits</label>
          <textarea
            id="Benefits"
            name="Benefits"
            value={job.Benefits}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="responsibilty" className="block mb-2">Responsibility</label>
          <textarea
            id="responsibilty"
            name="responsibilty"
            value={job.responsibilty}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="workType" className="block mb-2">Work Type</label>
          <input
            type="text"
            id="workType"
            name="workType"
            value={job.workType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="Tags" className="block mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            id="Tags"
            name="Tags"
            value={job.Tags.join(', ')}
            onChange={handleTagsChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Update Job
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;