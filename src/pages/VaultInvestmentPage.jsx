import Investment from "../components/Vault/Investment";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const VaultInvestmentPage = () => {
  return (
    <ProtectedRoute>
      <MainContentLayout pageTitle={'Vault'}>
        <Investment />
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default VaultInvestmentPage;