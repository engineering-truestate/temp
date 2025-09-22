import BdaAuctionPage from "../components/AuctionProperties/BDA/bdaAuctionPage";
import MainContentLayout from "../components/MainContentLayout";
import PageInstantSearch from "../components/InstantSearch/PageInstantSearch";
import ProtectedRoute from "../components/ProtectedRoute";

const BdaAuctionPageWrapper = () => {
  return (
    <ProtectedRoute>
      <PageInstantSearch>
        <MainContentLayout pageTitle="BDA Auction Plots">
          <BdaAuctionPage />
        </MainContentLayout>
      </PageInstantSearch>
    </ProtectedRoute>
  );
};

export default BdaAuctionPageWrapper;