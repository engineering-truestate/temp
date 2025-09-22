import Profile from "../components/Profile/Profile";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const ProfilePage = () => {
  return (
    <ProtectedRoute>
      <MainContentLayout pageTitle="Profile">
        <Profile />
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default ProfilePage;