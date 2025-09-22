import FindProject from "../components/Vault/FindProject";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const VaultFindProjectPage = () => {
  return (
    <ProtectedRoute>
      <MainContentLayout>
        <FindProject />
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default VaultFindProjectPage;