"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase';
import { onAuthStateChanged, User } from "firebase/auth";
import toast, { Toaster } from 'react-hot-toast';

interface Assignment {
  _id: string;
  name: string;
  email: string;
    phone: string;
    position: string;
  figmaLink?: string;
  googleDriveLink?: string;
  submittedAt: string;
}

const AdminPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let unsubscribe: () => void;
  
    const allowedEmails = ['sourav2000kumar07@gmail.com', 'divyankithub@gmail.com']; 
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (!currentUser) {
          router.push('/assignment/submit');
        } else if (!allowedEmails.includes(currentUser.email || '')) {
          router.push('/assignment/submit');
        } else {
          setUser(currentUser);
          setLoading(false);
          fetchAssignments();
        }
      });
    } else {
      console.error('Firebase auth is not initialized');
      router.push('/assignment/submit');
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);
    
  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/assignments');
      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }
      const data = await response.json();
      setAssignments(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setLoading(false);
    }
  };

  const openConfirmDialog = (id: string) => {
    setAssignmentToDelete(id);
    setShowConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setAssignmentToDelete(null);
  };

  const handleDelete = async () => {
    if (assignmentToDelete) {
      try {
        const response = await fetch(`/api/assignments/${assignmentToDelete}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete assignment');
        }
        toast.success('Assignment deleted successfully');
        setAssignments(assignments.filter(assignment => assignment._id !== assignmentToDelete));
      } catch (error) {
        console.error('Error deleting assignment:', error);
        toast.error('Failed to delete assignment');
      } finally {
        closeConfirmDialog();
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!user) return null;

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Admin Page - Assignment Submissions</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Position</th>
              <th className="py-3 px-6 text-left">Figma Link</th>
              <th className="py-3 px-6 text-left">Google Drive Link</th>
              <th className="py-3 px-6 text-left">Submitted At</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {assignments.map((assignment) => (
              <tr key={assignment._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{assignment.name}</td>
                <td className="py-3 px-6 text-left">{assignment.email}</td>
                    <td className="py-3 px-6 text-left">{assignment.phone}</td>
                <td className="py-3 px-6 text-left">{assignment.position}</td>
                <td className="py-3 px-6 text-left">
                  {assignment.figmaLink && (
                    <a href={assignment.figmaLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      View Figma
                    </a>
                  )}
                </td>
                <td className="py-3 px-6 text-left">
                  {assignment.googleDriveLink && (
                    <a href={assignment.googleDriveLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      View Drive
                    </a>
                  )}
                </td>
                <td className="py-3 px-6 text-left">{new Date(assignment.submittedAt).toLocaleString()}</td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => openConfirmDialog(assignment._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
           {showConfirmDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Assignment</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this assignment? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  id="cancel-btn"
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={closeConfirmDialog}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;