import VaultScreen from "../../../assets/vault/interfaceVault.webp";
import AddProjectToVault from "./AddProjectToVault";

function Intro({ projectSearchProps }) {
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="container relative z-10 pb-10 px-4 md:px-20 lg:px-24  md:pb-10 lg:pb-14 items-center flex flex-col justify-between gap md:gap-14 lg:gap-[4.5rem]">
      {/* Text Section */}
      <div className="container my-[24px] py-16 flex flex-col gap-6 md:gap-6 lg:gap-7 items-center bg-[#BFE9E6] rounded-lg">
        <div className="flex  lg:md:gap-6 lg:gap-7 gap-4 items-center">
          {/* Banner image removed during reorganization */}
          {/* Main Title & Subtitle Section */}
          <div className="flex flex-col lg:gap-5 md:gap-4 gap-2 text-center max-w-3xl px-4 md:px-0 my-2 md:my-4">
            {/* Main Title */}
            <div className="text-display-sm text-['Lora'] md:text-display-md lg:text-display-md font-heading font-bold">
              Check your home's value & manage it easily
            </div>
            {/* Subtitle */}
            <div className="text-heading-medium-xxs md:text-heading-medium-sm lg:text-heading-medium-md text-gray-800 font-subheading">
              Documentation, valuation, rentals, taxes - Vault lets you track
              them all in one place
            </div>
          </div>
          {/* Banner image removed during reorganization */}
        </div>
        <AddProjectToVault {...projectSearchProps} isMobile={isMobile} />
      </div>
      {/* Vault Screen Image (Visible only on larger screens) */}
      <img src={VaultScreen} alt="Vault Screen" className="hidden md:block" />
    </div>
  );
}

export default Intro;
