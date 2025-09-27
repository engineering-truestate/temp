import MainContentLayout from "../components/MainContentLayout";
import ProjectDetails from "../components/ProjectDetails/ProjectDetails";
import ProtectedRoute from "../components/ProtectedRoute";

const ProjectDetailsPage = () => {
  return (
    <MainContentLayout pageTitle={'Properties'}>
      <ProjectDetails />
    </MainContentLayout>
  );
};

export default ProjectDetailsPage;
