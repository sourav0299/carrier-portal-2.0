import React from 'react';

interface JobCardProps {
  id: string;
  jobTitle: string;
  location: string;
  date: string;
  exp: string;
  jobType: string;
  ctc: string;
  shortDesciption: string;
}

const JobCard: React.FC<JobCardProps> = ({ 
  id, 
  jobTitle, 
  location, 
  date, 
  exp, 
  jobType, 
  ctc, 
  shortDesciption 
}) => {
  return (
    <div className="border p-4 rounded-lg shadow-lg bg-white hover:shadow-2xl transition-shadow cursor-pointer">
      <h2 className="text-2xl font-semibold mb-2">{jobTitle}</h2>
      <p className="text-gray-600 mb-2">{shortDesciption}</p>
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>{location}</span>
        <span>{date}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>Experience: {exp}</span>
        <span>{jobType}</span>
      </div>
      <p className="text-lg font-bold mb-4">CTC: {ctc}</p>

      <div className="mt-4 py-2 text-blue-500 cursor-pointer hover:text-blue-700 transition-all duration-300 ease-in-out transform hover:animate-pulse">
        View Details
      </div>
    </div>
  );
};

export default JobCard;
