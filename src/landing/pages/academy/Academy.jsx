
import { featuredBlog } from '../../../../public/content/blogs/blogs';
import blogs from '../../../../public/content/blogs/blogs';
import Hero from '../academy/FeaturedHero';
import BlogCards from '../academy/BlogCards';

const Academy = () => {
  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <Hero featuredBlog={featuredBlog} />
        <BlogCards blogs={blogs} />
      </div>
    </div>
  );
};

export default Academy;
