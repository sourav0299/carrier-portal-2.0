"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { TbEyeHeart } from "react-icons/tb";

interface Job {
  date: string | number | Date;
  id: string;
  jobTitle: string;
  location: string;
  exp: string;
  jobType: string;
  ctc: string;
  shortDesciption: string;
  workType: string;
  Tags: string[];
  viewCount: number;
}

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Internship'];

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);



    const handleJobTypeChange = (jobType: string) => {
    setSelectedJobTypes(prevTypes => 
      prevTypes.includes(jobType)
        ? prevTypes.filter(type => type !== jobType)
        : [...prevTypes, jobType]
    );
  };

  const incrementViewCount = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/views`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to increment view count');
      }
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, viewCount: job.viewCount + 1 } : job
      ));
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

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

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => { 
    setSortOrder(event.target.value as 'newest' | 'oldest');
  }

  const sortedJobs = [...jobs].sort((a, b) => {
    const dataA = new Date(a.date).getTime();
    const dataB = new Date(b.date).getTime();
    return sortOrder === 'newest'? dataB - dataA : dataA - dataB;
  })

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center gap-10">
      {/* <div className="shadow rounded-lg w-[295px] h-[633px] overflow-hidden flex flex-col py-3 bg-white">
    <div 
      className="p-4 cursor-pointer flex justify-between items-center"
      onClick={toggleFilter}
    >
      <h3 className="text-lg font-semibold">Type of Employment</h3>
      <span>{isFilterOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
    </div>
    <div className={`flex-grow overflow-y-auto transition-all duration-300 ${isFilterOpen ? 'max-h-full' : 'max-h-0'}`}>
      <div className="px-4">
        {jobTypes.map(jobType => (
          <div key={jobType} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={jobType}
              checked={selectedJobTypes.includes(jobType)}
              onChange={() => handleJobTypeChange(jobType)}
              className="mr-2"
            />
            <label htmlFor={jobType}>{jobType}</label>
          </div>
        ))}
      </div>
    </div>
      </div> */}
      <div className=" flex flex-col max-h-full gap-5">
        <div className=" flex items-center justify-between shadow p-4 rounded-xl px-10 bg-white">
          <div className="text-[18px] text-[#9c9ca3]">
            <span className="font-bold text-[18px] text-[#151515]">{jobs.length < 10 ? `0${jobs.length}` : jobs.length}</span> Jobs Openings
          </div>
           <div className="text-lg text-[#9c9ca3] flex items-center">
            <span className="mr-2">Sort By:</span>
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="text-[18px] text-[#151515] font-bold bg-white rounded-md px-2 py-1"
            >
              <option value="newest">Newest Post</option>
              <option value="oldest">Oldest Post</option>
            </select>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedJobs.map((job) => (
          <div 
            key={job.id} 
            className="bg-white shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 h-auto w-[338px]"
            onClick={() => {
              incrementViewCount(job.id);
              router.push(`/jobs/${job.id}`);
            }}
          >
            <div className="p-6">
              <div className="flex gap-3">
                <div className="25c3ec">
                  <img src={`https://res.cloudinary.com/dzxx6craw/image/upload/v1731386508/6510c32fcb74863cdee88774dd7289b6_y5jm8l.png`} alt={job.jobTitle} className="object-cover w-auto h-[56px]" />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div className="text-wrap text-[12px] w-[111px]">{job.jobTitle}</div>
                  <div className="text-[10px] text-[#25c3ec]">{job.location}</div>
                </div>
                <div className="ml-auto flex items-center">
                  <div className="text-[12px] text-gray-500">
                    {new Date(job.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="text-[12px] font-semibold">{job.exp} Years Exp</div>
                <div className="text-[12px] font-semibold">{job.workType}</div>
                <div className="text-[12px] font-semibold">₹ {job.ctc} CTC</div>
              </div>
              <div className="">
                <div className="text-wrap text-[#bababa] font-rasa">
                  <p className="line-clamp-5 text-[12px] leading-tight">{job.shortDesciption}</p>
                </div>
              </div>
              <div className="py-2 flex items-center justify-between">
                <div className="text-[#25c3ec] text-[12px]">View More</div>
                <div className="flex items-center justify-center gap-1">
                  <TbEyeHeart />
                  {job.viewCount < 10 ? `0${job.viewCount}` : job.viewCount}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default JobsPage;