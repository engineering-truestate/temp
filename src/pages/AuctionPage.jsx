import { useState } from "react";
import { useLocation } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";
import AuctionProperties from "../components/AuctionProperties/AuctionProperties";
import MainContentLayout from "../components/MainContentLayout";
import PageInstantSearch from "../components/InstantSearch/PageInstantSearch";
import AuctionPageHeader from "../components/Headers/AuctionPageHeader";
import ProtectedRoute from "../components/ProtectedRoute";

const AuctionPage = () => {
  const location = useLocation();
  const [auctionView, setAuctionView] = useState("grid");

  const handleViewToggle = (newView, viewType) => {
    if (viewType === "auction") {
      setAuctionView(newView);
    }

    const route = location.pathname.split("/").join("_");
    const eventLabel = `view_changed_to_${newView}_in_${route}`;
    logEvent(analytics, "switch_view", { name: eventLabel });
  };


  return (
    <ProtectedRoute>
      <PageInstantSearch>
        <MainContentLayout pageTitle="Auction Properties">
          <AuctionPageHeader
            auctionView={auctionView}
            handleViewToggle={handleViewToggle}
          />
          <AuctionProperties
            auctionView={auctionView}
          />
        </MainContentLayout>
      </PageInstantSearch>
    </ProtectedRoute>
  );
};

export default AuctionPage;