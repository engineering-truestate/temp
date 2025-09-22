import SmallButton from '../button/SmallButton';
import LargeButton from '../button/LargeButton';
import arrowRightIcon from '../../assets/valueProposition/ArrowRight.svg';
import arrowRightGreenIcon from '../../assets/valueProposition/ArrowRightGreen.svg';
import JoinUsButton from '../../pages/home/JoinUsButton';
import { useSelector } from 'react-redux';

/**
 * ValuePropositionOdd Component
 * This component renders a value proposition section with an image, title, subtitle, description, and a button.
 * It's designed to display an "odd" layout where the image is on the left and text is on the right for larger screens.
 *
 * Props:
 * - title: The main heading of the value proposition.
 * - subtitle: A short subtitle or category.
 * - description: A detailed description or summary of the value proposition.
 * - linkText: The text displayed on the button linking to more details.
 * - linkHref: The URL the button will redirect to when clicked.
 * - imageSrc: The source URL for the accompanying image.
 * - icon: The icon displayed next to the subtitle.
 */

const ValuePropositionOdd = ({ title, subtitle, description, linkText, linkHref, imageSrc, icon }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-24 lg:gap-auto w-full">
      
      {/* Image Section */}
      {/* Image Section */}
      <div className="md:w-5/12 lg:w-1/2 justify-end flex">
        {/* Display the image alongside the text content */}
        <img 
          src={imageSrc} 
          alt={title} 
          className="rounded-lg w-full h-auto object-cover" 
        />
      </div>

      {/* Text Section */}
      <div className="md:w-7/12 lg:w-1/2 text-left">
        
        {/* Container for text content */}
        <div className="md:w-full lg:w-full flex flex-col gap-3 md:gap-4 lg:gap-5">

          {/* Subtitle with Icon */}
          <div className='flex gap-2 md:gap-3 items-center'>
            <div>
              {/* Icon next to subtitle */}
              <img src={icon} alt={title} className="h-5 md:h-7" />
            </div> 
            <h3 className="text-GableGreen uppercase font-medium text-heading-medium-xxxs md:text-heading-medium-xxxs lg:text-heading-medium-xs font-subheading">
              {subtitle}
            </h3>
          </div>

          {/* Title and Description */}
          <div className="flex flex-col gap-2 md:gap-3 lg:gap-4">
            {/* Title */}
            <h2 className="text-GreenBlack text-display-xxxs md:text-display-xs lg:text-display-sm font-heading">
              {title}
            </h2>
            {/* Description */}
            <p className="text-ShadedGrey font-body font-medium text-paragraph-xs md:text-paragraph-xxs lg:text-paragraph-lg pb-[0.625rem]">
              {description}
            </p>
            {!isAuthenticated && (
          <>
            <div className="flex flex-col gap-2">

              <JoinUsButton />
            </div>
          </>
        )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ValuePropositionOdd;
