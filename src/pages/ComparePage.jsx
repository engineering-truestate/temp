import ComparePage from "../components/Compare/ComparePage";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const ComparePageWrapper = () => {

  return (
    <ProtectedRoute>
      <MainContentLayout pageTitle="Compare">
        <ComparePage/>
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default ComparePageWrapper;