import React, { useState } from "react";
import { MdClose, MdFileDownload } from "react-icons/md";

interface ResumeViewerProps {
  resumeUrl: string;
  onClose: () => void;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({ resumeUrl, onClose }) => {
  const [viewerError, setViewerError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = resumeUrl.split('/').pop() || 'resume';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download the file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const renderContent = () => {
    if (viewerError) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="mb-4">Unable to display the file in the viewer.</p>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Open file in new tab
          </a>
        </div>
      );
    }

    if (resumeUrl.toLowerCase().endsWith(".pdf")) {
      return (
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(
            resumeUrl
          )}&embedded=true`}
          className="w-full h-full"
          title="Resume Viewer"
          onError={() => setViewerError(true)}
        />
      );
    }

    return (
      <iframe
        src={resumeUrl}
        className="w-full h-full"
        title="Resume Viewer"
        onError={() => setViewerError(true)}
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Resume Viewer</h2>
          <div className="flex items-center">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Download"
            >
              <MdFileDownload className="mr-2" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
              aria-label="Close"
            >
              <MdClose className="mr-2" />
              Close
            </button>
          </div>
        </div>
        <div className="flex-grow p-4 overflow-auto">
          <div className="w-full h-full">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;