import Report from "../components/Report/Report";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const ReportPage = () => {
  const data = {
    projectOverview: [
      { label: "Location", value: "Hsr Layout" },
      { label: "Configuration", value: "2 BHK" },
      { label: "Investment Amount", value: "₹65.25 Lac" },
    ],
  };

  return (
    <ProtectedRoute>
      <MainContentLayout>
        <Report data={data} />
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default ReportPage;