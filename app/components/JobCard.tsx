interface JobCardProps {
  id: string;
  title: string;
  description: string;
  salary: string;
}

const JobCard: React.FC<JobCardProps> = ({ id, title, description, salary }) => {
  return (
    <div className="border p-4 rounded-lg shadow-lg bg-white hover:shadow-2xl transition-shadow">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <p className="text-lg font-bold">Salary: {salary}</p>

      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;
