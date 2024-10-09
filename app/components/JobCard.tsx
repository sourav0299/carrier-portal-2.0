interface JobCardProps {
  id: string;
  title: string;
  description: string;
  salary: string;
}

const JobCard: React.FC<JobCardProps> = ({ id, title, description, salary }) => {
  return (
    <div className="border p-4 rounded-lg shadow-lg bg-white hover:shadow-2xl transition-shadow cursor-pointer">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <p className="text-lg font-bold">Salary: {salary}</p>

      <div className="mt-4 py-2 text-blue-500 cursor-pointer hover:text-blue-700 transition-all duration-300 ease-in-out transform hover:animate-pulse">
        View Details
      </div>
    </div>
  );
};

export default JobCard;
