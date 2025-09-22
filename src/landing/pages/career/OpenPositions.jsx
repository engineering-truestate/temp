// OpenPositions.jsx
// ========================
// This component renders the "Open Positions" section, displaying a list of available job opportunities.
// It uses the JobCard component to render each job listing.
// ========================

import JobCard from '../../components/career/job/JobCard'; // Component to display individual job details

// Define an array of job listings
const jobs = [
  { 
    title: 'HR Manager', 
    location: 'Onsite, Bangalore', 
    applyLink: '#' // Placeholder link for the job application
  },
  { 
    title: 'Sales Intern', 
    location: 'Remote, Bangalore', 
    applyLink: '#' // Placeholder link for the job application
  },
  // Add more job listings as needed
];

const OpenPositions = ({ id }) => {
  return (
    // Main section container for Open Positions
    <div className="bg-white" id={id} >
      <div className="container text-center flex flex-col gap-8 md:gap-12 lg:gap-16 py-16 md:py-14 px-4 md:px-20 lg:px-24">
        
        {/* Section Title */}
        <h2 className="text-display-xs md:text-display-sm lg:text-display-md font-heading font-bold text-GreenBlack !leading-large">
          Open Positions
        </h2>
        
        {/* Job Listings */}
        <div className="flex flex-col">
          {jobs.map((job, index) => (
            <JobCard
              key={index} // Using index as the key to uniquely identify each job listing
              title={job.title} // Job title
              location={job.location} // Job location
              applyLink={job.applyLink} // Link to apply for the job
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpenPositions; // Export the OpenPositions component
