import BlogPage from "../components/Blog/BlogPage";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const BlogPageWrapper = () => {
  return (
    <ProtectedRoute>
      <MainContentLayout pageTitle="Blogs">
        <BlogPage />
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default BlogPageWrapper;