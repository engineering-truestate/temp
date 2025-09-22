import Comparemobile from "../components/Compare/AddCompare";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const CompareAddPage = () => {
  return (
    <ProtectedRoute>
      <MainContentLayout>
        <Comparemobile />
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default CompareAddPage;