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


const Home = () => {
  return (
    <>
      {/* Promotional Modal */}
      <PromotionalModal />

      {/* Main Content */}
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