import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { User } from 'firebase/auth';
import { MdDelete } from "react-icons/md";
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  resume: File | null;
  coverLetter: string;
  portfolio: string;
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
    coverLetter: '',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, resume: null }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitDisabled) {
      console.log('Form submitted:', formData);
      onClose();
    }
  };

  const isSubmitDisabled = remainingCharacters < -20;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-80 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Apply for this job</h3>
          <form onSubmit={handleSubmit} className="mt-2">
            {['name', 'email', 'phoneNumber', 'portfolio'].map((field) => (
              <input
                key={field}
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                value={formData[field as keyof FormData] as string}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                onChange={handleInputChange}
                className="mt-2 p-2 w-full border rounded"
                required
              />
            ))}
            <input
              type="text"
              name="position"
              placeholder="Job Position"
              className="mt-2 p-2 w-full border rounded bg-gray-100 text-gray-700 cursor-not-allowed"
              value={jobTitle}
              disabled
            />
            <div className="mt-2 flex items-center">
              <input
                type="file"
                name="resume"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
                required
              />
              <label htmlFor="resume-upload" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                {formData.resume ? 'Change File' : 'Upload Resume'}
              </label>
              {formData.resume && (
                <div className="ml-2 flex items-center gap-5">
                  <span className="text-sm">{formData.resume.name}</span>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, resume: null }))}
                    className="ml-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    aria-label="Delete file"
                  >
                    <MdDelete className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <textarea
                name="coverLetter"
                placeholder="Cover Letter (300 letters maximum)"
                value={formData.coverLetter}
                onChange={handleChange}
                className={`w-full p-3 border ${remainingCharacters < 0 ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                rows={4}
                required
              ></textarea>
              <div className="absolute bottom-4 right-4">
                <svg width="80" height="80" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={radius} fill="none" stroke="#e0e0e0" strokeWidth="10" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <text x="50" y="55" textAnchor="middle" fontSize="16" fill={remainingCharacters < 0 ? '#ef4444' : '#3b82f6'}>
                    {remainingCharacters}
                  </text>
                </svg>
              </div>
            </div>

            <div className="items-center py-3">
              <button
                type="submit"
                className={`py-2 text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 ${
                  isSubmitDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 focus:ring-blue-300'
                }`}
                disabled={isSubmitDisabled}
              >
                Submit Application
              </button>
            </div>
          </form>
          <button
            onClick={onClose}
            className="mt-2 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
