import PropertiesDeals from "../components/PropertiesDeals/PropertiesDeals";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const OpportunitiesPage = () => {
  return (
    <ProtectedRoute>
      <MainContentLayout pageTitle="Exclusive Opportunities">
        <PropertiesDeals />
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default OpportunitiesPage;