import React from 'react';
import styles from './AgentModal.module.css';
import CalendarIcon from '/assets/icons/ui/info.svg';

const MeetingCard = ({ meeting }) => {
  const taskName = meeting?.taskName || 'No task name';
  const scheduleDate = meeting?.schedule?.date || 'No date';
  const scheduleTime = meeting?.schedule?.time || 'No time';

  return (
    <div className={`flex items-center w-full  bg-white border rounded-lg  sm:min-w-[200px] lg:min-w-fit min-w-[98%] mb-4 ${styles.meetingCard}`}>
      <div className={`w-2 h-20 mr-4 ${styles.yellow}`}></div>
      <div>
        <p className={styles.meetingTitle}>{taskName}</p>
        <p className={`flex items-center mt-2 ${styles.meetingDate}`}>
          <img src={CalendarIcon} className="mr-2" alt="Calendar Icon" />
          {scheduleDate}, {scheduleTime}
        </p>
      </div>
    </div>
  );
};

export default MeetingCard;
