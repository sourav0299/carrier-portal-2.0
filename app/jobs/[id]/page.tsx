"use client";

import React, { useState, useEffect } from 'react';
import { FaCheck } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { FaEnvelope } from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";
import  ApplicationModal  from '../../components/ApplicationModal'
import { auth } from '../../firebase'
import { User } from 'firebase/auth';

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
  date: any;
}

const JobDescriptionPage: React.FC = () => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
    let unsubscribe: () => void;
    if(auth){
      unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user);
      });
    }
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

    return () => {
      if(unsubscribe){
        unsubscribe();
      }
    }
  }, []);

  const handleShareClick = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); 
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const toggleModal = () => {
    if(user){
      setIsModalOpen(!isModalOpen);
    }else{
      router.push('/login');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="container mx-auto px-60 py-8 flex justify-between">
      <div className="">
        <div 
        onClick={() => router.push('/')}
        className=" text-[#1565d8] text-[16px] font-bold py-5 pt-10 cursor-pointer" 
      >
        View All open position
      </div>
      <h1 className="text-[56px] font-bold text-[#183b56] max-w-[628px]">{job.jobTitle}</h1>
      <div className="flex items-center text-[20px] py-2 text-[#183b56]">
        <span className="">
          {job.location}
        </span>,
        <span className="pl-1">
          {job.jobType}
        </span>
        <span className="px-1">·</span>
        <span className="">
          {job.workType}
        </span>
      </div>
      <div className="pt-40">
        <div className="max-w-[628px] whitespace-normal break-words text-[16px] text-[#5a7184]">
          {job.positionDesciption}
        </div>
        <div className="py-5">
          <div className="font-bold text-4xl py-3 text-[#183b56]">
            Who We Are
          </div>
          <div className="max-w-[628px] whitespace-normal break-words text-[16px] text-[#5a7184]">
            {job.companyDesciption}
          </div>
        </div>
        <div className="py-5">
          <div className="font-bold text-4xl py-3 text-[#183b56]">
            Working with us
          </div>
          <div className="max-w-[628px] whitespace-normal break-words text-[16px] text-[#5a7184]">
            {job.companyCulture}
          </div>
        </div>
        <div className="py-5">
          <div className="font-bold text-4xl py-3 text-[#183b56]">
            Benefits
          </div>
          <div className="max-w-[628px] whitespace-normal break-words text-[16px] text-[#5a7184]">
            <ul className="list-none pl-0">
              {job.Benefits.split('.').filter(benefit => benefit.trim()).map((benefit, index) => (
                <li key={index} className="mb-2 flex items-start">
                  <FaCheck className="mr-2 mt-1 flex-shrink-0 text-[#36b37e]" />
                  <span>{benefit.trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="py-5">
          <div className="font-bold text-4xl py-3 text-[#183b56]">
            About the role
          </div>
          <div className="max-w-[628px] whitespace-normal break-words text-[16px] text-[#5a7184]">
            <ul className="list-none pl-0">
              {job.responsibilty.split('.').filter(benefit => benefit.trim()).map((benefit, index) => (
                <li key={index} className="mb-2 flex items-start">
                  <FaCheck className="mr-2 mt-1 flex-shrink-0 text-[#36b37e]" />
                  <span>{benefit.trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      </div>
      <div className="flex">
        <div className="sticky top-8 self-start max-w-[280px]">
          <div className="gap-3 flex flex-col">
            <div className="shadow rounded flex flex-col items-center justify-center p-6 gap-3">
              <button onClick={toggleModal} className="flex items-center justify-center p-5 bg-[#1565d8] hover:bg-[#0c4bb3] text-white rounded w-[232px] h-[48px]">
                <FaEnvelope className='w-auto h-[14px]' /> <span className="pl-2 font-bold text-[16px]">Apply Now</span>
              </button>
               <button 
                onClick={handleShareClick}
                className="flex items-center justify-between p-5 border-2 border-[#1565d8] text-[#1565d8] rounded w-[232px] h-[48px] relative"
              >
                <span className="pl-2 font-bold text-[16px]">Share Now</span>
                <span className=""><IoShareSocialSharp className='w-auto h-[14px]' /></span>
                {copySuccess && (
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-500 text-white text-xs py-1 px-2 rounded mb-2">
                    Link copied!
                  </span>
                )}
              </button>
            </div>
            <div className="shadow rounded flex flex-col p-6 gap-3">
              <div className="">
                <span className="text-md font-bold text-[#183b56]">
                  {new Date(job.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="">
                <div className="text-md font-bold text-[#183b56]">Location</div>
                <div className="text-sm text-[#5a7184]">{job.location}</div>
              </div>
              <div className="">
                <div className="text-md font-bold text-[#183b56]">Work Type</div>
                <div className="text-sm text-[#5a7184]">{job.workType}</div>
              </div>
              <div className="">
                <div className="text-md font-bold text-[#183b56]">Classification</div>
                <div className="text-sm text-[#5a7184]">{job.Tags}</div>
              </div>
            </div>
          </div>
        </div>
          <ApplicationModal isOpen={isModalOpen} onClose={toggleModal} jobTitle={job.jobTitle} />
      </div>
      
    </div>
  );
};

export default JobDescriptionPage;