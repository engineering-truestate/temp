import React, { useState, useEffect } from 'react';
import MeetingCard from '../AgentModal/MeetingCard';
import styles from './ProjectDetails.module.css';

import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../slices/agentSlice";
import { selectUserPhoneNumber } from "../../slices/userAuthSlice";

const meetings = [
  { date: '2024-07-05', time: '10:00 AM', action: 'Discuss project timeline' },
  { date: '2024-07-06', time: '2:30 PM', action: 'Review prototype' },
  { date: '2024-07-08', time: '11:15 AM', action: 'Planning session' },
  { date: '2024-07-05', time: '10:00 AM', action: 'Discuss project timeline' },
  { date: '2024-07-06', time: '2:30 PM', action: 'Review prototype' },
];

const ProjectUpcomingMeet = ({ project }) => {
  const dispatch = useDispatch();

  const userPhoneNumber = useSelector(selectUserPhoneNumber);
  const { userDetails, agentDetails, status } = useSelector(
    (state) => state.agent
  );

  useEffect(() => {
    if (userPhoneNumber) {
      dispatch(fetchUserDetails(userPhoneNumber));
    }
  }, [dispatch, userPhoneNumber]);

  const [myMeetings, setMyMeetings] = useState();

  useEffect(() => {
    if (project) {
      let meetings = userDetails?.tasks?.filter((task) => (task.type === "Customer") && (task.property) && (task.property === project.projectName)) || [];
      setMyMeetings(meetings);
    }
  }, [userDetails, project]);

  if (meetings.length === 0) return null;
  return (
    <>
      {myMeetings && myMeetings.length > 0 &&
        <div className="lg:border lg:border-gray-300 rounded-md md:shadow-sm lg:px-5 lg:py-4   ">
          <h3 className={`mb-5 ${styles.subheading}  sm:mb-6  lg:mb-4 hidden lg:block `}>Upcoming Meetings</h3>
          <h3 className={`mb-5 ${styles.heading}  sm:mb-6  lg:mb-4 block lg:hidden `}>Upcoming Meetings</h3>
          <div className={`overflow-y-auto w-full ${styles.mh}  flex gap-2 lg:flex-col`}>
            {myMeetings.map((meeting, index) => (
              <MeetingCard key={index} meeting={meeting} />
            ))}
          </div>
        </div>
      }
    </>
  );
};

export default ProjectUpcomingMeet;