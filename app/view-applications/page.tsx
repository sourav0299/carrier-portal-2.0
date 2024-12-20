"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";
import ResumeViewer from "../components/ViewResume";

interface Application {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  portfolio: string;
  resumeUrl: string;
  jobTitle: string;
  experience: string;
  submittedAt: string;
}

const AdminApplicationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(
    null
  );
  const [selectedApplications, setSelectedApplications] = useState<string[]>(
    []
  );
  const router = useRouter();

  useEffect(() => {
    let unsubscribe: () => void;

    const allowedEmails = [
      "sourav2000kumar07@gmail.com",
      "divyankithub@gmail.com",
    ];
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (!currentUser) {
          router.push("/login");
        } else if (!allowedEmails.includes(currentUser.email || "")) {
          router.push("/");
        } else {
          setUser(currentUser);
          setLoading(false);
          fetchApplications();
        }
      });
    } else {
      console.error("Firebase auth is not initialized");
      router.push("/login");
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/applications");
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      const data = await response.json();
      setApplications(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setLoading(false);
    }
  };

  const openConfirmDialog = (id: string) => {
    setApplicationToDelete(id);
    setShowConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setApplicationToDelete(null);
  };

  const openResumeViewer = (resumeUrl: string) => {
    setSelectedResume(resumeUrl);
  };

  const closeResumeViewer = () => {
    setSelectedResume(null);
  };

  const handleDelete = async () => {
    if (applicationToDelete) {
      try {
        const response = await fetch(
          `/api/applications/${applicationToDelete}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete application");
        }
        toast.success("Application deleted successfully");
        setApplications(
          applications.filter(
            (application) => application._id !== applicationToDelete
          )
        );
      } catch (error) {
        console.error("Error deleting application:", error);
        toast.error("Failed to delete application");
      } finally {
        closeConfirmDialog();
      }
    }
  };

  const handleSelectApplication = (id: string) => {
    setSelectedApplications((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applications.map((app) => app._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedApplications.length === 0) return;

    try {
      const response = await fetch("/api/applications/bulk-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedApplications }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete applications");
      }

      const result = await response.json();
      toast.success(
        `Successfully deleted ${result.deletedCount} application(s)`
      );

      setApplications((prev) =>
        prev.filter((app) => !selectedApplications.includes(app._id))
      );
      setSelectedApplications([]);
    } catch (error) {
      console.error("Error deleting applications:", error);
      toast.error("Failed to delete applications");
    }
  };

  const sortedApplications = [...applications].sort((a, b) => {
    return (
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  });

  if (loading) return <Loader />;

  if (!user) return null;



  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Admin Page - Job Applications</h1>
        <button
          onClick={handleBulkDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Delete Selected ({selectedApplications.length})
        </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedApplications.length === applications.length}
                />
              </th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Job Title</th>
              <th className="py-3 px-6 text-left">Experience</th>
              <th className="py-3 px-6 text-left">Portfolio</th>
              <th className="py-3 px-6 text-left">Resume</th>
              <th className="py-3 px-6 text-left">Submitted At</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {sortedApplications.map((application) => (
              <tr
                key={application._id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">
                  <input
                    type="checkbox"
                    onChange={() => handleSelectApplication(application._id)}
                    checked={selectedApplications.includes(application._id)}
                  />
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {application.name}
                </td>
                <td className="py-3 px-6 text-left">{application.email}</td>
                <td className="py-3 px-6 text-left">
                  {application.phoneNumber}
                </td>
                <td className="py-3 px-6 text-left">{application.jobTitle}</td>
                <td className="py-3 px-6 text-left">
                  {application.experience} years
                </td>
                <td className="py-3 px-6 text-left">
                  <a
                    href={application.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Portfolio
                  </a>
                </td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => openResumeViewer(application.resumeUrl)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Resume
                  </button>
                </td>
                <td className="py-3 px-6 text-left">
                  {new Date(application.submittedAt).toLocaleString()}
                </td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => openConfirmDialog(application._id)}
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
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Delete Application
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this application? This action
                  cannot be undone.
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
      {selectedResume && (
        <ResumeViewer resumeUrl={selectedResume} onClose={closeResumeViewer} />
      )}
    </div>
  );
};

export default AdminApplicationPage;
