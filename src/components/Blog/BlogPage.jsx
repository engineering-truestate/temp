import BlogCard from './BlogCard';
import { Link } from 'react-router-dom';
import PopularTopics from './PopularTopics';
import styles from './Blog.module.css';
import blogs from '../../../public/content/blogs/blogs.js';

const BlogPage = () => {
  const popularTopics = blogs.filter((topic) => topic.isPopular === true);

  return (
    <div className=" flex justify-between py-2 px-4 md:px-8 ">

      {/* Main Content */}
      <div className='flex-col w-[100%] sm:mt-5  xl:w-[70%] '>
        <p className={`block mt-2 mb-4  md:hidden ${styles.blog_h3}`}>Popular Topics</p>
        <div
          className=" flex-shrink   h-auto  w-[100%] xl:w-[95%] "
          style={{
            height: 'auto',
          }}
        >
          {blogs
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((blog) => (
              <Link key={blog.id} to={`/blog/${blog.title}`}>
                <BlogCard blog={blog} />
              </Link>
            ))}
        </div>
      </div>

      {/* Sidebar */}
      <div
        className="  hidden xl:block xl:border-l-2 "
        style={{
          width: '30%',
          height: 'auto',
        }}
      >
        <h2 className={` ${styles.blog_h5} mb-5 ml-auto xl:ml-6`}>Popular Topics</h2>
        {popularTopics
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((popularTopic) => (
            <Link to={`/blog/${popularTopic.title}`} key={popularTopic}>
              <PopularTopics topic={popularTopic} />
            </Link>
          ))}
      </div>
    </div>
  );
};

export default BlogPage;
