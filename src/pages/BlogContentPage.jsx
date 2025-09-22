import BlogContent from "../components/Blog/BlogContent";
import MainContentLayout from "../components/MainContentLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const BlogContentPage = () => {
  return (
    <ProtectedRoute>
      <MainContentLayout>
        <BlogContent />
      </MainContentLayout>
    </ProtectedRoute>
  );
};

export default BlogContentPage;