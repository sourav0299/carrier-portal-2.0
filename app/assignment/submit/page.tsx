"use client";

import { useState, useEffect } from "react";
import {useRouter} from "next/navigation"
import { auth } from "../../firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { Tooltip } from 'react-tooltip'
import { MdContentPaste } from "react-icons/md";

interface Job{
  title: string;
}

const SubmitForm: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [jobTitles, setJobTitles] = useState<Job[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    figmaLink: '',
    googleDriveLink: ''
  });
    const [submissionExists, setSubmissionExists] = useState(false);
  const router = useRouter();
  
    useEffect(() => {
      const fetchJobTitles = async () => {
        try {
          const response = await fetch('/api/jobs');
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          if (data.success && Array.isArray(data.jobs)) {
            const titles = data.jobs.map((job: any) => ({ title: job.jobTitle }));
            setJobTitles(titles);
          } else {
            throw new Error('Invalid data format');
          }
        } catch (error) {
          console.error('Error fetching job titles:', error);
        }
      };
    
      fetchJobTitles();
    }, []);

  useEffect(() => {
    let unsubscribe: () => void;
  
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setFormData(prev => ({
            ...prev,
            name: currentUser.displayName || '',
            email: currentUser.email || ''
          }));
        checkExistingSubmission(currentUser.email);
        }else{
            router.push('/login')
        }
      });
    } else {
      toast.error('Firebase auth is not initialized');
    }
  
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
    
    const checkExistingSubmission = async (email: string | null) => {
    if (!email) return;
    try {
      const response = await fetch(`/api/check-submission?email=${email}`);
      if (response.ok) {
        const data = await response.json();
        setSubmissionExists(data.exists);
      }
    } catch (error) {
      console.error("Error checking submission:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await checkExistingSubmission(formData.email);
    if(submissionExists){
      return;
    }
    try {
      const response = await fetch('/api/assignment-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit assignment');
      }

      toast.success('Assignment submitted successfully');
      setFormData({
        name: user?.displayName || '',
        email: user?.email || '',
        phone: '',
        position: '',
        figmaLink: '',
        googleDriveLink: ''
      });
      setSubmissionExists(true);
    } catch (error) {
      toast.error(`Failed to submit: ${error}`);
    }
  };

  return (
    <div className="mx-auto h-screen bg-[#f5f5f5]">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex items-center justify-center gap-8 py-5">
        <div className="bg-white shadow rounded-xl w-[800px] h-[560px] relative overflow-hidden">
          <form onSubmit={handleSubmit}  className="">
            <div className="py-5 w-full flex flex-col gap">
            <h1 className="text-[#141516] font-bold text-4xl text-center">Submit Assignment</h1>
            <p className="text-center pt-3">Every submission brings you one step closer to success!</p>
            <div className="pt-5 px-6">
              <div className="flex items-center justify-between px-5">
                <div className="group w-[330px]">
                  <label 
                    htmlFor="name" 
                    className="block mb-2 text-[#8d8d8d] group-focus-within:text-black transition-colors duration-300"
                  >
                    Full Name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border-b-2 border-[#8d8d8d] focus:outline-none focus:border-black transition-colors duration-300"
                    required
                  />
                </div>
                <div className="group w-[330px]">
                  <label 
                    htmlFor="email" 
                    className="block mb-2 text-[#8d8d8d] group-focus-within:text-black transition-colors duration-300"
                  >
                    Email <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border-b-2 border-[#8d8d8d] focus:outline-none focus:border-black transition-colors duration-300"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between px-5 pt-3">
                <div className="group w-[330px]">
                  <label 
                    htmlFor="phone" 
                    className="block mb-2 text-[#8d8d8d] group-focus-within:text-black transition-colors duration-300"
                  >
                    Phone Number <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border-b-2 border-[#8d8d8d] focus:outline-none focus:border-black transition-colors duration-300"
                    required
                    placeholder="Enter Phone Number"
                  />
                </div>
                <div className="group w-[330px]">
                  <label 
                    htmlFor="position" 
                    className="block mb-2 text-[#8d8d8d] group-focus-within:text-black transition-colors duration-300"
                  >
                    Position <span className="text-red-500 font-bold">*</span>
                  </label>
                  <select
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full p-2 border-b-2 border-[#8d8d8d] focus:outline-none focus:border-black transition-colors duration-300 bg-transparent"
                    required
                  >
                    <option value="">Select a position</option>
                    {jobTitles.map((job, index) => (
                      <option key={index} value={job.title}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="group w-full px-5 pt-3">
                <label 
                  htmlFor="figmaLink" 
                  className="block mb-2 text-[#8d8d8d] group-focus-within:text-black transition-colors duration-300"
                >
                  Figma Link <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="Drop your Portfolio Link"
                    id="figmaLink"
                    name="figmaLink"
                    value={formData.figmaLink}
                    onChange={handleInputChange}
                    className="w-full p-2 pr-20 border-b-2 border-[#8d8d8d] focus:outline-none focus:border-black transition-colors duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        setFormData(prev => ({ ...prev, figmaLink: text }));
                      } catch (err) {
                        console.error('Failed to read clipboard contents: ', err);
                      }
                    }}
                    className="flex items-center gap-2 absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm"
                  >
                   <span className=""><MdContentPaste /></span> Paste
                  </button>
                </div>
              </div>
                <div className="group w-full px-5 pt-3">
                  <label 
                    htmlFor="googleDriveLink" 
                    className="block mb-2 text-[#8d8d8d] group-focus-within:text-black transition-colors duration-300"
                  >
                    Assignment Link <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="Drop your Assignment Link"
                      id="googleDriveLink"
                      name="googleDriveLink"
                      value={formData.googleDriveLink}
                      onChange={handleInputChange}
                      className="w-full p-2 pr-20 border-b-2 border-[#8d8d8d] focus:outline-none focus:border-black transition-colors duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          setFormData(prev => ({ ...prev, googleDriveLink: text }));
                        } catch (err) {
                          console.error('Failed to read clipboard contents: ', err);
                        }
                      }}
                      className="flex items-center gap-2 absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm"
                    >
                     <span className=""><MdContentPaste /></span> Paste
                    </button>
                </div>
                <div className="pt-5 relative">
  {submissionExists ? (
    <>
      <button
        type="button"
        className="px-4 py-2 rounded w-[200px] h-[54px] text-md font-bold bg-gray-400 text-white cursor-not-allowed"
        data-tooltip-id="submit-tooltip"
        data-tooltip-content="You have already submitted an assignment. Only one submission is allowed."
      >
        Already Submitted
      </button>
      <Tooltip id="submit-tooltip" place="top" style={{ zIndex: 50 }} />
    </>
  ) : (
    <button
      type="submit"
      className="px-4 py-2 rounded w-[200px] h-[54px] text-md font-bold bg-[#25c3ec] hover:bg-[#1da8cc] text-white"
    >
      Submit Assignment
    </button>
  )}
</div>
              </div>
            </div>
            </div>
          </form>
          <div className="absolute bottom-0 right-0">
    <div className="relative w-[105px] h-[78px]">
      <div className="absolute bottom-0 right-0 z-10">
        <svg width="105" height="78" viewBox="0 0 105 78" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="72.585" cy="72.5069" r="72.4932" fill="#1E1E1E"/>
        </svg>
      </div>
      <div className="absolute -top-5 -left-4 z-20">
        <svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="37.1898" cy="37.1898" r="37.1898" fill="#484848" fillOpacity="0.5"/>
        </svg>
      </div>
    </div>
  </div>
        </div>
        <div className="bg-[#1e1e1e] h-[560px] w-[558px] rounded-xl shadow text-white flex items-center justify-center">
          <div className="">
            <div className="">
              <h1 className="text-[40px] font-bold px-16 pl-16">Your talent could be the next big thing <span className="text-[#25c3ec]">we’re waiting</span> for.</h1>
            </div>
          <div className="pt-5 flex items-start justify-start px-16">
            <p className="font-bold text-start">-Dezainahub!</p>
          </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-20">
        <div className="text-[#1e1e1e] opacity-50">@ 2023 Dezainahub! | Need Help?</div>
        <div className="flex gap-3">
          <button onClick={() => window.open('https://www.instagram.com/dezainahub_?igsh=MWY3NzgxYWd4b3Q2', '_blank')} className="bg-[#1e1e1e] rounded-full w-[27px] h-[27px] flex items-center justify-center">
            <span className="text-white">
              <FaInstagram />
            </span>
          </button>
          <button onClick={() => window.open('', '_blank')} className="bg-[#1e1e1e] rounded-full w-[27px] h-[27px] flex items-center justify-center">
            <span className="text-white">
              <FaLinkedinIn />
            </span>
          </button>
          <button onClick={() => window.open('https://www.facebook.com/dezainahub?mibextid=ZbWKwL', '_blank')} className="bg-[#1e1e1e] rounded-full w-[27px] h-[27px] flex items-center justify-center">
            <span className="text-white">
              <FaFacebookF />
            </span>
          </button>
          <button onClick={() => window.open('', '_blank')} className="bg-[#1e1e1e] rounded-full w-[27px] h-[27px] flex items-center justify-center">
            <span className="text-white">
              <FaTwitter />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitForm;
