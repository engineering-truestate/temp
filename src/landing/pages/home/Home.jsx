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
import { useModalConfig } from "../../../contexts/ModalConfigContext.jsx";


const Home = () => {
  const { modalConfig } = useModalConfig(); 

  return (
    <>
      {/* Promotional Modal - Config available immediately */}
      <PromotionalModal
        isEnabled={modalConfig.isEnabled}
        delay={modalConfig.delay}
        sessionStorageKey={modalConfig.sessionStorageKey}
        content={modalConfig.content}
        styling={modalConfig.styling}
        images={modalConfig.images}
        navigationPath={modalConfig.navigationPath}
        analyticsEvent={modalConfig.analyticsEvent}
        flag={modalConfig.flag}
      />

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
