import { useDispatch } from 'react-redux';
import { setShowSignInModal } from '../../../../slices/modalSlice';
import filters from '../../../assets/investment-opp/filterSection/filters.webp'
import LargeButton from '../../../components/button/LargeButton';




const BrowseOptions = () => {
  const dispatch = useDispatch();
  return (
    <section className="property-browse-options bg-white ">
      <div className="container lg:py-28 md:py-20 py-16 lg:px-24 md:px-20 px-4 ">
        <div className='flex flex-col md:flex-row justify-between items-center gap-7  '>

          {/* image for filters section */}
          <div>
            <img src={filters} alt="filters BG image" className='lg:max-w-[34.375rem] md:max-w-[25rem] w-full h-auto' />
          </div>


          <div className='flex flex-col lg:gap-5 md:gap-4 gap-3 md:max-w-[50%] lg:max-w-[40%] w-full'>
            <div className="flex flex-col gap-2 md:gap-3 lg:gap-4 ">
              <h2 className='font-heading lg:text-display-md md:text-display-sm text-display-xs '>
                Properties That Suit Your Needs
              </h2>
              <p className='lg:text-paragraph-lg md:text-paragraph-xxs text-paragraph-xs font-body text-gray-800'>
                Every investor has a unique investment strategy. Filter properties according to your budget, holding period, project age, and let our recommendation tools do the rest.
              </p>
            </div>

            {/* Call to Action Button - Browse Investment Properties */}
            <div>
              <LargeButton
                label="Browse Properties"
                onClick={() => dispatch(setShowSignInModal({ showSignInModal: true, redirectUrl: ('/properties') }))}
                classes="font-body text-label-sm md:text-label-md"
                eventName="cta_click"                     // Tracking event name
                eventCategory="CTA"                       // Tracking category
                eventAction="click"                       // Tracking action
                eventLabel="browse_cta_investment_opp_filters" // Tracking label
              />
            </div>

          </div>
        </div>
      </div>


    </section>
  );
};

export default BrowseOptions;
