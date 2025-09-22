import Requirement from "../components/Requirements/Requirement";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const RequirementPage = () => {
  return (
    <ProtectedRoute>
      <MainContentLayout pageTitle="Request">
        <Requirement />
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default RequirementPage;