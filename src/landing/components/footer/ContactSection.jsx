import React from 'react';
import QR from '../../assets/footer/QRWhatsapp.png'

import { logEvent } from 'firebase/analytics';
import { analytics } from '../../../firebase';

const ContactSection = () => {
  return (
    <div className="flex flex-col text-left gap-4 md:gap-2 lg:pl-6 w-full lg:w-[80%]">

      {/* Headings */}
      <div className="flex-col flex gap-1 leading-[150%] text-center lg:text-left">
        <div className="font-subheading font-medium text-base md:text-lg text-AthensGrey">
          Interested in knowing more?
        </div>
        <div className="font-subheading font-bold text-2xl md:text-[1.875rem] text-Anzac">
          Send us your details <br className="md:hidden" /> and <br className="md:hidden" /> we'll be in touch.
        </div>
      </div>

      {/* Contact Section */}
      <div className="flex items-start justify-start">
        
        {/* Mail and Phone No. */}
        <div className="flex-col flex gap-8 mt-1 text-left leading-[120%] items-center md:items-start font-subheading text-base md:text-lg underline font-medium text-AthensGrey">
          <div>
            <a
              href="mailto:contact@truestate.in"
              className="cursor-pointer"
              onClick={() => {
                // Track email click event
              logEvent(analytics, 'email_click_footer')
              }}
            >
              contact@truestate.in
            </a>
          </div>
          <div>
            <a
              href="tel:+918420566770"
              className="cursor-pointer"
              onClick={() => {
                // Track contact click event
                logEvent(analytics, "contact_click_footer")
        
              }}
            >
              +91 842-056-6770"
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className='pt-2 px-7 md:px-8 lg:px-2 xl:px-16 mx-auto'>
          <div className="flex-col justify-center items-start mx-auto gap-1">
            <div className="h-[2.125rem] w-[0.063rem] bg-AthensGrey ml-2"></div>
            <div className="font-body font-normal text-base text-AthensGrey">Or</div>
            <div className="h-[2.125rem] w-[0.063rem] bg-AthensGrey ml-2"></div>
          </div>
        </div>
        
        {/* WhatsApp */}
        <div className="flex-col items-center gap-2 text-center xl:pr-8">
          <a 
            href="https://wa.link/g99e1b" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => {
              // Track WhatsApp QR code click event
              logEvent(analytics, 'wa_qr_footer')
            }}
          >
            <img
              src={QR} // Replace with the correct path to your QR code image
              alt="WhatsApp QR Code"
              className="mx-auto w-16 md:w-28"
            />
          </a>

          {/* <span className="text-ShadedWhite font-body text-sm md:text-base font-normal">
            Scan or Tap for WhatsApp
          </span> */}
        </div>
      </div>
    </div>
  );
};


export default ContactSection;


