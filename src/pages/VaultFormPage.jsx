import VaultForm from "../components/Vault/Vaultform";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const VaultFormPage = () => {
  return (
    <ProtectedRoute>
      <MainContentLayout>
        <VaultForm />
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default VaultFormPage;