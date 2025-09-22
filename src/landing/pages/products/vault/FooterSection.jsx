import { useDispatch } from "react-redux";
import LargeButton from "../../../components/button/LargeButton";
import { setShowSignInModal } from "../../../../slices/modalSlice";

const CheckIcon = () => (
  <svg
    className="w-4 h-4 fill-current text-white mr-2 flex-shrink-0"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 10.17L3.83 8l-1.415 1.414L6 13l8-8-1.415-1.415z" />
  </svg>
);

const FooterSection = () => {
  const dispatch = useDispatch();
  return (
    <section className="bg-gradient-to-r from-[#2B896C] to-[#042D2B] text-white py-16 px-4 w-[86vw] mx-auto translate-y-1 md:translate-y-4 z-40 -mb-[50px] rounded-lg">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-[36px] font-semibold mb-[36px] font-heading">
          Begin your real estate journey with TruEstate—completely free.
        </h2>

        <div className="mx-auto w-fit">
          <LargeButton
            label="Get Started!"
            onClick={() =>
              dispatch(
                setShowSignInModal({
                  showSignInModal: true,
                  redirectUrl: "/vault/investment",
                })
              )
            }
            classes="font-body text-label-sm md:text-label-md border-white bg-white !text-GableGreen hover:bg-transparent hover:!text-white whitespace-nowrap"
            eventName="click_footer_get_started" // Tracking event name
            eventCategory="CTA" // Tracking category
            eventAction="click" // Tracking action
            eventLabel="get_started" // Tracking label for Sign In button
          />
        </div>

        <div className="mt-[36px] flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-10 font-lora">
          <div className="flex items-center">
            <CheckIcon />
            <span className="uppercase text-sm">No Initial Investment</span>
          </div>
          <div className="flex items-center">
            <CheckIcon />
            <span className="uppercase text-sm">
              Latest Tech with Data Available
            </span>
          </div>
          <div className="flex items-center">
            <CheckIcon />
            <span className="uppercase text-sm">24×7 Customer Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterSection;
