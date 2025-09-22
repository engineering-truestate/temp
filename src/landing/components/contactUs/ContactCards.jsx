/**
 * ContactCards.jsx
 * 
 * This component renders a list of contact cards that display an icon, title, and optional value or description.
 * Each card can be either a button or a link based on the presence of an onClick function. 
 * This allows for flexible usage where some cards can trigger actions (e.g., opening a Calendly popup), 
 * while others can link to external resources (e.g., phone numbers, email addresses).
 * 
 * Dependencies:
 * - Firebase Analytics: Used for tracking button clicks via logEvent from 'firebase/analytics'.
 * - Tailwind CSS: Assumes Tailwind CSS classes are available for styling.
 * 
 * Props:
 * - cards (Array): An array of objects representing each contact card. Each object can contain the following keys:
 *     - icon (String): Path to the icon image for the card.
 *     - title (String): Title text to display in the card.
 *     - value (String, optional): Optional text value for the card, displayed under the title.
 *     - description (String, optional): Alternative to value; displays descriptive text under the title if provided.
 *     - link (String, optional): URL or action link for the card if it functions as an anchor.
 *     - onClick (Function, optional): Click handler function for the card if it functions as a button.
 *     - eventName (String, optional): Name for the Firebase Analytics event tracking.
 *     - eventLabel (String, optional): Label for the Firebase Analytics event tracking.
 * 
 * Example Usage:
 * ```
 * const contactCards = [
 *   {
 *     icon: 'path/to/phoneIcon.svg',
 *     title: 'Call Us',
 *     link: 'tel:+1234567890',
 *     eventName: 'cta_click',
 *     eventLabel: 'call_us'
 *   },
 *   {
 *     icon: 'path/to/demoIcon.svg',
 *     title: 'Need a Demo?',
 *     onClick: handleOpenDemo,
 *     eventName: 'cta_click',
 *     eventLabel: 'book_demo'
 *   }
 * ];
 * 
 * <ContactCards cards={contactCards} />
 * ```
 * 
 * Notes:
 * - For proper event tracking, ensure `firebase/analytics` is configured in your project.
 * - When providing `onClick`, the component will render a button for that card; otherwise, it renders an anchor.
 * - Ensure that any links using `target="_blank"` include `rel="noopener noreferrer"` for security.
 * 
 */


import { logEvent } from 'firebase/analytics';
import { analytics } from '../../../firebase';

const ContactCards = ({ cards }) => {
  return (
    // Container for all contact cards with responsive layout
    <div className="flex flex-col w-full md:justify-between xl:h-[36vh] md:w-10/12 lg:w-2/3 gap-4 md:mt-0">
      
      {/* Map over the array of cards to render each contact card */}
      {cards.map((card, index) => (
        
        // Conditional rendering: render as a button if the card has an onClick handler, otherwise as a link
        card.onClick ? (
          <button
            key={index}
            onClick={() => {
              // Log event to Firebase Analytics if eventName and eventLabel are provided
              if (card.eventName && card.eventLabel) {
                logEvent(analytics, card.eventName, { name: card.eventLabel }); // Log with card.eventLabel
              }
              // Trigger the onClick function, e.g., to open Calendly for "Need a demo?" card
              card.onClick();
            }} 
            className="flex items-center bg-white border-[1px] border-ShadedWhite p-4 md:p-6 rounded-lg gap-3 lg:gap-5
                       transition duration-300 ease-in-out hover:border-black flex-grow"
          >
            {/* Icon for the card */}
            <img
              src={card.icon} 
              alt={`${card.title} icon`} 
              className="mt-[1px] w-5 h-auto md:w-7" // Icon size adjustments
            />

            {/* Card content section: title and optional value/description */}
            <div className="text-left">
              
              {/* Title of the card */}
              <div className="text-heading-semibold-xs md:text-heading-semibold-xs lg:text-heading-semibold-md font-subheading text-GreenBlack">
                {card.title} {/* Dynamic title */}
              </div>

              {/* Display value or description, if available */}
              <div className="text-gray-800 font-body text-paragraph-xxs md:text-paragraph-xs lg:text-paragraph-lg">
                {card.value || card.description} {/* Dynamic value or description */}
              </div>

            </div>
          </button>
        ) : (
          // Render as a link if no onClick function is provided
          <a 
            key={index} 
            href={card.link} 
            target="_blank" 
            rel="noopener noreferrer" // Security measure for external links
            onClick={() => {
              // Log event to Firebase Analytics if eventName and eventLabel are provided
              if (card.eventName && card.eventLabel) {
                logEvent(analytics, card.eventName, { name: card.eventLabel }); // Log with card.eventLabel
              }
            }}
            className="flex items-center bg-white border-[1px] border-ShadedWhite p-4 md:p-6 rounded-lg gap-3 lg:gap-5
                       transition duration-300 ease-in-out hover:border-black flex-grow"
          >
            {/* Icon for the card */}
            <img
              src={card.icon} 
              alt={`${card.title} icon`} 
              className="mt-[1px] w-5 h-auto md:w-7" // Icon size adjustments
            />

            {/* Card content section: title and optional value/description */}
            <div className="text-left">
              
              {/* Title of the card */}
              <div className="font-semibold font-subheading text-heading-semibold-xs lg:text-heading-semibold-md text-GreenBlack">
                {card.title} {/* Dynamic title */}
              </div>

              {/* Display value or description, if available */}
              <div className="text-gray-800 font-body text-paragraph-xxs md:text-paragraph-xs lg:text-paragraph-lg">
                {card.value || card.description} {/* Dynamic value or description */}
              </div>

            </div>
          </a>
        )
      ))}
    </div>
  );
};

export default ContactCards;
