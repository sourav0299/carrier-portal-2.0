// app/page.tsx
import JobCard from '../app/components/JobCard';  // Import the JobCard component

const HomePage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to the Career Portal</h1>
      <p className="mb-4">
        Find your dream job today! Browse through available positions and apply now.
      </p>

      <div className="grid grid-cols-1 gap-4">
        {/* Example Job Listings */}
        <JobCard title="Frontend Developer" description="React, Next.js, TypeScript" salary="$80,000" />
        <JobCard title="Backend Developer" description="Node.js, Express, MongoDB" salary="$90,000" />
        <JobCard title="Full Stack Engineer" description="React, Node.js, TypeScript" salary="$100,000" />
      </div>
    </div>
  );
};

export default HomePage;
