
import JobCard from './components/JobCard';
import { getJobs } from './utils/jobApis';

export default async function HomePage() {
  const jobs = await getJobs();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to the Career Portal</h1>
      <p className="mb-4">
        Find your dream job today! Browse through available positions and apply now.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job, index) => (
          <JobCard key={index} {...job} />
        ))}
      </div>
    </div>
  );
}