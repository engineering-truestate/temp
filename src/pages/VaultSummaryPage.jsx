import VaultSummary from "../components/Vault/VaultSummary";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const VaultSummaryPage = () => {
  return (
    <ProtectedRoute>
      <MainContentLayout>
        <VaultSummary />
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default VaultSummaryPage;