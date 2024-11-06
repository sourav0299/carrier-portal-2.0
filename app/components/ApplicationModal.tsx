import { useState } from 'react'

const ApplicationModal: React.FC<{ isOpen: boolean; onClose: () => void; jobTitle: string }> = ({ isOpen, onClose, jobTitle }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: null as File | null,
    coverLetter: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-80 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Apply for this job</h3>
          <form onSubmit={handleSubmit} className="mt-2">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleInputChange}
              className="mt-2 p-2 w-full border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              className="mt-2 p-2 w-full border rounded"
              required
            />
            <input
              type="text"
              name="phone-number"
              placeholder="Contact Number"
              onChange={handleInputChange}
              className="mt-2 p-2 w-full border rounded"
              required
            />
            <input
              type="text"
              name="position"
              placeholder="Job Position"
              className="mt-2 p-2 w-full border rounded bg-gray-100 text-gray-700 cursor-not-allowed"
              value={jobTitle}
              disabled
            />
            <input
              type="text"
              name="portfolio"
              placeholder="Links of portfolio/website"
              onChange={handleInputChange}
              className="mt-2 p-2 w-full border rounded"
              required
            />
            <input
              type="file"
              name="resume"
              onChange={handleFileChange}
              className="mt-2 p-2 w-full border rounded"
              required
            />
            <textarea
              name="coverLetter"
              placeholder="Cover Letter"
              onChange={handleInputChange}
              className="mt-2 p-2 w-full border rounded"
              rows={4}
              required
            >
            </textarea>
            <div className="items-center py-3">
              <button
                type="submit"
                className="py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
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