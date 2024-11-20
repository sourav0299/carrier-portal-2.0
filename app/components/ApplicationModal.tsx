import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { User } from 'firebase/auth';
import { MdDelete, MdClose, MdOutlineFileUpload } from "react-icons/md";
import { motion, useMotionValue, useTransform } from 'framer-motion';
import toast, { Toaster } from "react-hot-toast";

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  resume: File | null;
  portfolio: string;
  experience: string;
}

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, jobTitle }) => {
  const maxLetters = 300;
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    resume: null,
    experience: '',
    portfolio: ''
  });
  const [text, setText] = useState('');
  const characterCount = text.length;

  const progress = useMotionValue(characterCount / maxLetters);
  const color = useTransform(progress, [0, (maxLetters - 20) / maxLetters, 1], ['#3b82f6', '#fbbf24', '#ef4444']);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = useTransform(progress, (p) => circumference * (1 - p));
  const remainingCharacters = maxLetters - characterCount;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    setText(inputText.slice(0, maxLetters + 20));
    setFormData((prev) => ({ ...prev, coverLetter: inputText }));
    progress.set(Math.min(inputText.length / maxLetters, 1));
  };

  useEffect(() => {
    const unsubscribe = auth?.onAuthStateChanged((user: User | null) => {
      if (user) {
        setFormData((prev) => ({
          ...prev,
          name: user.displayName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || ''
        }));
      }
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
   if (e.target.files && e.target.files.length > 0) {
     const file = e.target.files[0];
     
     if (file.type !== 'application/pdf') {
       toast.error('Please upload a PDF file');
       return;
     }
 
     setFormData((prev) => ({ ...prev, resume: file }));
   }
 };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
  
    try {
      let resumeUrl = '';
      if (formData.resume) {
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', formData.resume);
        cloudinaryFormData.append('upload_preset', 'sourav0299'); // Using the new upload preset
  
        const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`, {
          method: 'POST',
          body: cloudinaryFormData,
        });
  
        if (!cloudinaryResponse.ok) {
          throw new Error('Failed to upload file to Cloudinary');
        }
  
        const cloudinaryData = await cloudinaryResponse.json();
        resumeUrl = cloudinaryData.secure_url;
      }
  
      const applicationData = {
        ...formData,
        jobTitle,
        resumeUrl,
      };
  
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
  
      toast.success('Application submitted successfully');
    setTimeout(() => {
      onClose();
    }, 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };
  const isSubmitDisabled = remainingCharacters < -20;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-80 overflow-y-auto h-full w-full z-50 flex ">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="relative top-20 mx-auto p-5 border shadow-lg rounded-md bg-white w-full max-w-[662px] h-[592px] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          <MdClose className="w-6 h-6" />
        </button>
        <div className="mt-3 text-center">
          <h3 className="text-3xl leading-6 font-medium text-gray-900">Want to join our team?</h3>
          <h3 className="text-sm leading-6 text-gray-900 my-2">Your talent could be the next big thing we’re waiting for.</h3>
          <form onSubmit={handleSubmit} className="mt-2 mx-5">
            <div className="grid grid-cols-2 gap-8 mt-4">
              {['name', 'email', 'phoneNumber', 'portfolio'].map((field) => (
                <div key={field} className="flex flex-col">
                  <label htmlFor={field} className="text-left text-sm font-medium text-gray-700 mb-1">
                    {field === 'name' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    id={field}
                    type={field === 'email' ? 'email' : field === 'phoneNumber' ? 'tel' : 'text'}
                    name={field}
                    value={formData[field as keyof FormData] as string}
                    placeholder={field === 'phoneNumber' ? 'Enter full number with country code' : field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                    onChange={handleInputChange}
                    className={`w-full p-2 border-b-2 border-[#8d8d8d] focus:outline-none focus:border-black transition-colors duration-300 ${field === 'email' ? 'cursor-not-allowed' : ''}`}
                    required
                    disabled={field === 'email'}
                  />
                </div>
              ))}
              <div className="">
              <label htmlFor="position" className="block text-left text-sm font-medium text-gray-700 mb-1">
                Job Position
              </label>
              <input
                id="position"
                type="text"
                name="position"
                placeholder="Job Position"
                className="cursor-not-allowed w-full p-2 border-b-2 border-[#8d8d8d] focus:outline-none focus:border-black transition-colors duration-300"
                value={jobTitle}
                disabled
              />
              </div>
              <div className="">
              <label htmlFor="experience" className="block text-left text-sm font-medium text-gray-700 mb-1">
                Job Experience
              </label>
              <input
                id="experience"
                type="text"
                name="experience"
                placeholder="Job Relevent Experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full p-2 border-b-2 border-[#8d8d8d] focus:outline-none focus:border-black transition-colors duration-300"
              />
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="resumeUpload" className="block text-left text-sm font-medium text-gray-700 mb-1">
                Upload Resume
              </label>
              <div className="relative">
                <label htmlFor="resumeUpload" className="flex items-center justify-center w-full h-16 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-pointer hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none px-4">
                  {formData.resume ? (
                    <span className="flex items-center gap-2 truncate">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="truncate">{formData.resume.name}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <MdOutlineFileUpload />
                      Click and Upload your Resume
                    </span>
                  )}
                  {formData.resume && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setFormData((prev) => ({ ...prev, resume: null }));
                      }}
                      className="flex items-center text-sm text-red-500 hover:text-red-700 ml-2"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  )}
                </label>
                <input
                  id="resumeUpload"
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </div>
            </div>
            <div className="py-3 mt-4 flex">
              <button
                type="submit"
                className="py-2 px-6 bg-[#1e1e1e] text-white text-base font-medium rounded-md w-[203px] h-[59px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1e1e1e] hover:opacity-80 transition-opacity duration-300"
              >
                Apply
              </button>
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
      </div>
    </div>
  );
};

export default ApplicationModal;
