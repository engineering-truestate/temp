// Home.js - Clean, no loading states, no re-renders!
import Hero from "../home/Hero";
import Partners from "../home/Partners";
import InvestmentOptionsSection from "../home/InvestmentOptionsSection";
import Values from "../home/Values";
import ServicesSection from "../home/ServicesSection";
import Working from "../home/Working";
import Carousel from "../home/Carousel.jsx";
import Banners from "./Banners.jsx";
import JoinOurWhatsappCommunity from "./JoinOurWhatsappCommunity.jsx";
import PromotionalModal from "../../../components/Website/PromotionalModal.jsx";

// ✅ import modalConfig from the combined context
import { useModalConfig } from "../../../contexts/SiteConfigContext.jsx";

const Home = () => {
  const { modalConfig } = useModalConfig(); // ✅ modal config from context


  return (
    <>
      {/* Promotional Modal - Config available immediately */}
      {modalConfig && modalConfig.isEnabled && (
        <PromotionalModal
          // spread all modalConfig props instead of typing them one by one
          {...modalConfig}
        />
      )}

      {/* Main Content - Renders immediately with no delays */}
      <Hero />
      <Banners />
      <Carousel />
      <JoinOurWhatsappCommunity />
      <InvestmentOptionsSection />
      <Partners />
      <Values />
      <div className="hidden md:block">
        <Working />
      </div>
      <ServicesSection />
    </>
  );
};

export default Home;
