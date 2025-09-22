import HelpMobile from "../components/Help/HelpMobile";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const HelpPage = () => {
  return (
    <ProtectedRoute>
      <MainContentLayout pageTitle="Help">
        <HelpMobile />
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default HelpPage;