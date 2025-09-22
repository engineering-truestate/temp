import ComparePage from "../components/Compare/ComparePage";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const ComparePageWrapper = () => {
  const data = {
    similarProperties: [
      {
        name: "Mahindra Zen",
        location: "Hsr layout",
        config: "2 BHK",
        unitPrice: "₹4.25 Crs",
        stage: "New Launch",
        investmentAmount: "₹65.25 Lac",
        targetPrice: "₹1.25 Cr",
      },
      {
        name: "Sobha Neopolis",
        location: "Hsr layout",
        config: "7 BHK",
        unitPrice: "₹4.25 Crs",
        stage: "New Launch",
        investmentAmount: "₹65.25 Lac",
        targetPrice: "₹1.25 Cr",
      },
    ],
  };

  return (
    <ProtectedRoute>
      <MainContentLayout pageTitle="Compare">
        <ComparePage projects={data.similarProperties} />
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default ComparePageWrapper;