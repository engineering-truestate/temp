import Vault_Investment from "../components/Vault/VaultInvestment";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const VaultInvestmentDetailsPage = () => {
  const data = {
    projectOverview: [
      { label: "Location", value: "Hsr Layout" },
      { label: "Configuration", value: "2 BHK" },
      { label: "Investment Amount", value: "₹65.25 Lac" },
    ],
  };

  return (
    <ProtectedRoute>
      <MainContentLayout pageTitle={'Vault'}>
        <Vault_Investment data={data} />
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default VaultInvestmentDetailsPage;