"use client";

import { useState, useEffect } from "react";
import {useRouter} from "next/navigation"
import { auth } from "../../firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

const SubmitForm: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (error) {
      toast.error(`Failed to submit: ${error}`);
    }
  };

  return (
    <div className="mx-auto h-screen bg-gray-500">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex items-center justify-around py-10">
        <div className="bg-white shadow rounded w-[751px] h-[562px]">
          <div className="">
            <h1 className="">Submit Assignment</h1>
          </div>
        </div>
        <div className="">
          <div className="">
            <h1 className=""></h1>
          </div>
          <div className="">
            <p className=""></p>
          </div>
        </div>
      </div>
    </div>
    //   <div className="max-w-xl mx-auto p-4">
    //     <Toaster position="top-center" reverseOrder={false} />
    //   <h1 className="text-2xl font-bold mb-6">Submit Assignment</h1>

    //   <form onSubmit={handleSubmit} className="space-y-4">
    //     <div>
    //       <label htmlFor="name" className="block mb-2">Your Name</label>
    //       <input
    //         type="text"
    //         id="name"
    //         name="name"
    //         value={formData.name}
    //         onChange={handleInputChange}
    //         className="w-full p-2 border rounded"
    //       />
    //     </div>

    //     <div>
    //       <label htmlFor="email" className="block mb-2">Your Email</label>
    //       <input
    //         type="email"
    //         id="email"
    //         name="email"
    //         value={formData.email}
    //         onChange={handleInputChange}
    //         className="w-full p-2 border rounded"
    //       />
    //     </div>

    //     <div>
    //       <label htmlFor="phone" className="block mb-2">Phone Number</label>
    //       <input
    //         type="text"
    //         id="phone"
    //         name="phone"
    //         value={formData.phone}
    //         onChange={handleInputChange}
    //         className="w-full p-2 border rounded"
    //         required
    //       />
    //     </div>
              
    //     <div>
    //       <label htmlFor="position" className="block mb-2">Applied for position:</label>
    //       <input
    //         type="text"
    //         id="position"
    //         name="position"
    //         value={formData.position}
    //         onChange={handleInputChange}
    //         className="w-full p-2 border rounded"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label htmlFor="figmaLink" className="block mb-2">Figma Link</label>
    //       <input
    //         type="url"
    //         id="figmaLink"
    //         name="figmaLink"
    //         value={formData.figmaLink}
    //         onChange={handleInputChange}
    //         className="w-full p-2 border rounded"
    //       />
    //     </div>

    //     <div>
    //       <label htmlFor="googleDriveLink" className="block mb-2">Google Drive Link</label>
    //       <input
    //         type="url"
    //         id="googleDriveLink"
    //         name="googleDriveLink"
    //         value={formData.googleDriveLink}
    //         onChange={handleInputChange}
    //         className="w-full p-2 border rounded"
    //       />
    //     </div>

    //     <button
    //       type="submit"
    //       className={`px-4 py-2 rounded ${
    //         submissionExists 
    //           ? "bg-gray-400 cursor-not-allowed" 
    //           : "bg-blue-500 hover:bg-blue-600"
    //       } text-white`}
    //       title={submissionExists ? "You have already submitted an assignment. Only one submission is allowed." : ""}
    //       disabled={submissionExists}
    //     >
    //       {submissionExists ? "Already Submitted" : "Submit"}
    //     </button>
    //   </form>
    // </div>
  );
};

export default SubmitForm;
