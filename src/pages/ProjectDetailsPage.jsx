import MainContentLayout from "../components/MainContentLayout";
import ProjectDetails from "../components/ProjectDetails/ProjectDetails";
import ProtectedRoute from "../components/ProtectedRoute";

const ProjectDetailsPage = () => {
  return (
    <MainContentLayout>
      <ProjectDetails />
    </MainContentLayout>
  );
};

export default ProjectDetailsPage;
