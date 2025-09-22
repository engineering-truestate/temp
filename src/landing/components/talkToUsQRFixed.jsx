import React from 'react';
import talktoUsQR from '../assets/talktousQR.svg';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase';
import { useDispatch, useSelector } from "react-redux";

const TalkToUsQRFixed = ({ link }) => {



  const isPropertiesPath2 = () => location.pathname.startsWith('/properties/') && location.pathname.length > '/properties/'.length;

  const isAuthenticated = useSelector((state=>state.auth.isAuthenticated));


  return (
    <a href="https://chat.whatsapp.com/G0ukJV5Qlz9A6Ckt9hYsou?mode=ac_t" target="_blank" rel="noopener noreferrer" onClick={() => logEvent(analytics, 'click_join_our_community')}  >
      <div
        className={`fixed   ${ !isAuthenticated && isPropertiesPath2()  ? `bottom-28  sm:bottom-20 lg:bottom-5  ` : `bottom-5   `  }   right-5 z-40 bg-white flex items-center justify-center rounded-lg border border-gray-200 hover:cursor-pointer hover:shadow-home-shadow md:w-28 md:h-28 w-20 h-20`} // Position at the bottom right corner with high z-index
     
      >
        <img 
          src={talktoUsQR} 
          alt="Scan QR Code" 
          className="w-[90%] h-[90%] object-cover" 
        />
      </div>
    </a>
  );
};

export default TalkToUsQRFixed;
