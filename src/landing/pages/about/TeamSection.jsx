// TeamSection.jsx
// ========================
// This component renders the "Team Behind It All" section.
// It features a Leadership section, highlighting key leadership team members,
// followed by a general team members grid display.
// ========================
import React, { useEffect, useState } from 'react';
import LeadershipCard from './LeadershipCard'; // Component to display leadership team members
import TeamMemberCard from './TeamMemberCard'; // Component to display general team members


// Import leadership images
import DJ from '../../assets/about/members/DJsir.webp';
import Amit from '../../assets/about/members/AmitSir.webp';



import Samarth from '../../assets/about/members/Samarth.webp'
import Siddarth from '../../assets/about/members/siddharth.webp';
import Abhiraj from '../../assets/about/members/abhiraj.webp'
import aditya from '../../assets/about/members/aditya.webp'
import ankit from '../../assets/about/members/ankit.webp'
import anurag from '../../assets/about/members/anurag.webp'
import rajan from '../../assets/about/members/rajan.webp'
import raman from '../../assets/about/members/raman.webp'

import siddh from '../../assets/about/members/siddh.webp'
import srikanth from '../../assets/about/members/srikanth.webp'
import swaraj from '../../assets/about/members/swaraj.webp'
import yash from '../../assets/about/members/yash.webp'


const TeamSection = () => {


  const [isSingleColumn, setIsSingleColumn] = useState(window.innerWidth < 408);

  useEffect(() => {
    const handleResize = () => setIsSingleColumn(window.innerWidth < 408);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Leadership Members Data with message
  const leadership = [
    {
      name: "Dhananjay Mishra",
      position: "Co-founder",
      image: DJ,
      isLeadership: true, // Indicates this person is part of leadership
      message: {
        title: "\"We're redefining the way Indians invest in real estate for the better\"",
        content: "Dhananjay Mishra has worked in Bengaluru's startup ecosystem for 12+ year. He has been part of growth-stage teams at Flipkart, Cleartax and Udaan, and has also founded multiple consumer tech startups of his own.",
      },
    },
    {
      name: "Amit Daga",
      position: "Co-founder",
      image: Amit,
      isLeadership: true,
      message: {
        title: "\"We want to make TruEstate India's go-to platform for real estate investing\"",
        content: "Amit Daga has worked in multiple roles in startups like Flipkart and Lendingkart.  He believes people are the key to a team's success - and has built and managed teams across functions like sales, strategy, operations and more.",
      },
    },
  ];

  // General Team Members Data
  const teamMembers = [
    //  {
    //     name: "Rahul K.",
    //     position: "Program Manager",
    //     image: raman, // Placeholder image 
    //  },

    {
      name: "Raman Mishra",
      position: "Program Manager",
      image: raman, // Placeholder image
    },
    {
      name: "Srikanth G.",
      position: "Operations Manager",
      image: srikanth, // Placeholder image
    },
    {
      name: "Siddarth Gujrati",
      position: "Program Manager",
      image: Siddarth, // Placeholder image
    },
    {
      name: "Ankit Tiwari",
      position: "Product Designer",
      image: ankit, // Placeholder image
    },
    {
      name: "Rajan Yadav",
      position: "Software Developer",
      image: rajan, // Placeholder image
    },
    {
      name: "Anurag Yadav",
      position: "Associate Product Manager",
      image: anurag, // Placeholder image
    },
    {
      name: "Siddh Jain",
      position: "SDE Intern",
      image: siddh, // Placeholder image
    },
    {
      name: "Abhiraj Rajput",
      position: "SDE Intern",
      image: Abhiraj, // Placeholder image
    },
    {
      name: "Yash Agrawal",
      position: "SDE Intern",
      image: yash, // Placeholder image
    },
    {
      name: "Samarth Jangir",
      position: "Program Management Intern",
      image: Samarth, // Placeholder image
    },
  ];

  

  return (
    <div>
      <div className="container mx-auto text-center flex flex-col gap-8 md:gap-14 lg:gap-20 px-4 py-10 md:py-14 lg:py-24 md:px-20 lg:px-24">
        
        {/* Section Title */}
        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 md:mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold font-heading text-GreenBlack">
            The Team Behind It All
          </h2>
          <p className="text-heading-medium-xxs md:text-heading-medium-sm lg:text-heading-medium-md text-gray-800 font-subheading">
              Driven by Passion, Powered by Expertise
          </p>
        </div>

        {/* Leadership Section */}
        <div className="flex lg:flex-row flex-col place-items-center items-center justify-center xl:max-w-100 w-full mx-auto gap-4 md:gap-10 xl:gap-24 grid-cols-aut ">
          {leadership.map((leader, index) => (
            <LeadershipCard
              key={index} // Unique key for each leader
              image={leader.image} // Leadership image
              name={leader.name} // Leadership name
              position={leader.position} // Leadership position
              message={leader.message} // Leadership message
              isLeadership={leader.isLeadership} // Pass the isLeadership prop to indicate 
            />
          ))}
        </div>

        <div
          className={`grid grid-cols-2 xl:grid-cols-3 justify-items-center gap-10 md:gap-16 lg:gap-20`}
          style={{
            gridTemplateColumns: isSingleColumn ? '1fr' : undefined,
          }}
        >
      {teamMembers.map((member, index) => (
        <TeamMemberCard 
          key={index} // Unique key for each team member
          image={member.image} // Team member image
          name={member.name} // Team member name
          position={member.position} // Team member position
        />
      ))}
    </div>
      </div>
    </div>
  );
};

export default TeamSection;

