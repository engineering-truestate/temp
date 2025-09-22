import AddProjectModal from "../components/Vault/AddProjectModal";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const VaultPage = () => {
  return (
    <ProtectedRoute>
      <MainContentLayout>
        <AddProjectModal />
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default VaultPage;