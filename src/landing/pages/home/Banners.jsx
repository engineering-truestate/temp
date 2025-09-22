import React from "react";
import { ArrowRight } from "lucide-react";
import BankAuction from "../../assets/home/BankAuction.png";
import Building from "../../assets/home/building.png";
import coin from "../../assets/home/coin.png";
import { analytics } from "../../../firebase";
import { logEvent } from "firebase/analytics";
import { setShowSignInModal } from "../../../slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BannerCard = ({ title, description, image, onClick }) => {
  return (
    <div
      className="rounded-xl p-6 flex flex-col justify-between relative overflow-hidden"
      style={{
        borderRadius: "12px",
        background: "linear-gradient(180deg, #FFE6DF 0%, #F5C5B9 100%)",
      }}
    >
      <div className="flex-grow">
        <div className="w-3/4 h-full">
          <h2 className="text-xl font-montserrat sm:text-2xl font-bold text-gray-900 mb-1">
            {title}
          </h2>
          <p className="text-gray-800 font-lato mb-4 sm:mb-6">{description}</p>
          <button
            onClick={onClick}
            className="flex items-center bg-white text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Explore <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
      <div>
        <img
          src={image}
          style={{
            position: "absolute",
            right: "0px",
            bottom: "0px",
            zIndex: 10,
          }}
          className="h-28 w-auto sm:h-32 md:h-40"
        />
      </div>
    </div>
  );
};

export default function Banners() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleSignInClick = (from) => {
    let redirect = null;
    switch (from) {
      case "bank_auction":
        redirect = "/auction";
        break;
      case "pre_launch":
        redirect =
          "/properties?property-data%5BrefinementList%5D%5Bstatus%5D%5B0%5D=pre%20launch";
        break;
      case "exclusive_deals":
        redirect = "/opportunities";
        break;
      default:
        redirect = "/properties";
    }

    if (isAuthenticated) {
      navigate(redirect);
    } else {
      dispatch(
        setShowSignInModal({ showSignInModal: true, redirectUrl: redirect })
      );
    }
  };

  const bannerData = [
    {
      title: "Bank Auction",
      description: "Unlock secure property options at below-market prices",
      image: BankAuction,
      slug: "bank_auction",
    },
    {
      title: "Pre-Launch Projects",
      description:
        "Invest early in projects that give you returns of up to 20% IRR",
      image: Building,
      slug: "pre_launch",
    },
    {
      title: "Exclusive Opportunities",
      description: "Get early access to undervalued, off-market opportunities",
      image: coin,
      slug: "exclusive_deals",
    },
  ];

  return (
    <div className="lg:h-full overflow-hidden pt-6 pb-16 md:pb-20 lg:pb-[72px] px-4 md:px-20 lg:px-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {bannerData.map((banner) => (
          <BannerCard
            key={banner.slug}
            title={banner.title}
            description={banner.description}
            image={banner.image}
            onClick={() => {
              handleSignInClick(banner.slug);
              logEvent(analytics,  `click_landing_${banner.title}`, {
                Name: "banner_explore",
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}
