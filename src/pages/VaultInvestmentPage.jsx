import Investment from "../components/Vault/Investment";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const VaultInvestmentPage = () => {
  return (
    <ProtectedRoute>
      <MainContentLayout>
        <Investment />
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default VaultInvestmentPage;