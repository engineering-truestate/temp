// ```javascript
// /**
//  * Hero Component
//  * 
//  * This component renders the Hero section of a page, showcasing a "featured blog" post
//  * with a header, background image, and text content. It includes elements for blog metadata 
//  * (such as author, category, and date), the blog's title and excerpt, and a "Read More" link 
//  * that navigates to the full blog post.
//  *
//  * The structure includes:
//  * - **Blogs Badge**: Displays a "Blogs" label in a styled badge for visual emphasis.
//  * - **Section Heading**: A centered heading, acting as an introduction to the blog section.
//  * - **Featured Blog Content**: Comprises text details and an image associated with the featured blog post.
//  *   - **Blog Metadata**: Lists the blog’s author, category, and publication date.
//  *   - **Blog Title**: Main title for the featured blog.
//  *   - **Blog Excerpt**: A preview of the blog's content.
//  *   - **Read More Link**: Redirects to the full article.
//  *   - **Image**: Displays an image for the featured blog, styled with a 16:9 aspect ratio.
//  *
//  * @param {object} props - Properties passed to the component
//  * @param {object} props.featuredBlog - Data for the featured blog post, including:
//  *   - `author` (string): Name of the blog's author.
//  *   - `category` (string): Category of the blog post.
//  *   - `date` (string): Publication date.
//  *   - `title` (string): Title of the blog post.
//  *   - `excerpt` (string): Short summary or teaser text for the blog.
//  *   - `link` (string): URL link to the full blog post.
//  *   - `image` (string): Image URL for the blog cover or thumbnail.
//  *
//  * Usage:
//  * ```
//  * <Hero featuredBlog={blogData} />
//  * ```
//  *
//  * Styling:
//  * - Uses utility classes (e.g., `flex`, `items-center`, `bg-cover`) for layout and styling.
//  * - Responsive design with adjustments for small, medium, and large screens.
//  * - Requires Tailwind CSS for utility-based styling.
//  *
//  */
// ```


import PropTypes from 'prop-types';
import './Academy.css'

const Hero = ({ featuredBlog }) => {
  return (
    <section 
      className="relative flex flex-col items-center justify-center w-full bg-no-repeat bg-cover bg-center"
    >
      {/* Container and Inner Content */}
      <div className="container mx-auto px-6 md:px-24 lg:px-24 md:pt-20 lg:pt-0 py-16 md:py-10 lg:py-0 flex flex-col items-center justify-center gap-10 md:gap-14 lg:gap-[72px] lg:h-[90vh]">
        
        {/* Blogs Badge and Heading */}
        <div className="flex flex-col gap-5 md:gap-6 lg:gap-7 items-center">
          
          {/* Blogs Badge */}
          <div className="flex items-center bg-gray-200 text-ShadedGrey py-1 px-4 md:py-1 md:px-5 lg:py-2 lg:px-6 rounded-full w-fit">
            <p className="flex items-center text-label-xs md:text-label-sm lg:text-label-md font-body">
              Blogs
            </p>
          </div>
          
          {/* Section Heading */}
          <h1 className="text-display-sm md:text-display-md lg:text-display-lg font-heading text-GreenBlack max-w-3xl md:max-w-[65vw] lg:max-w-[60vw] text-center">
            Our Knowledge Hub
          </h1>
        </div>
        
        {/* Featured Blog Content */}
        <div className="flex flex-col-reverse lg:flex-row gap-8 md:gap-10 lg:gap-12 lg:justify-between items-center">
          
          {/* Featured Blog Text */}
          <div className="lg:w-5/12 flex flex-col gap-4 lg:gap-6">
            
            {/* Blog Metadata (Author, Category, Date) */}
            <p className="text-heading-bold-xxxxs lg:text-heading-bold-xxxs xl:text-heading-bold-xs text-ShadedGrey font-body flex items-center lg:items-start 2xl:items-center gap-2 uppercase xs-flex-col md-lg-flex-col whitespace-nowrap ">
              <span>BY {featuredBlog.author}</span>
              {/* Divider line */}
              <span className="flex-grow border-t border-[1px] border-ShadedGrey/20 mx-2"></span>  

              <div className="flex items-center gap-2">
                          
              <span>{featuredBlog.category}</span>
              
              {/* Bullet and Date */}
              <span>&bull;</span>
              <span>{featuredBlog.date}</span>
              </div>
            </p>

            {/* Blog Title */}
            <h2 className="text-display-xs lg:text-display-xs xl:text-display-md font-heading text-GreenBlack">
              {featuredBlog.title}
            </h2>
            
            {/* Blog Excerpt */}
            <p className="font-body text-paragraph-xs lg:text-paragraph-md xl:text-paragraph-lg text-GreenBlack leading-relaxed lg:leading-relaxed max-w-lg line-clamp-3">
              {featuredBlog.excerpt}
            </p>
            
            {/* Read More Link */}
            <a href={featuredBlog.link} className="text-ShadedGrey hover:text-GableGreen font-subheading text-heading-bold-xxxxs lg:text-heading-bold-xxxs xl:text-heading-bold-xs">
              READ MORE &gt;&gt;
            </a>
          </div>
          
          {/* Featured Blog Image */}
          <div className="lg:w-7/12 flex md:justify-end">
            <img 
              src={featuredBlog.blogImageUrl} 
              alt={featuredBlog.title} 
              className="rounded-lg md:w-full lg:w-[35rem] md:h-auto lg:h-[21rem] object-cover"
              style={{
                aspectRatio: '16 / 9',  // Set aspect ratio to 16:9
              }} 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

Hero.propTypes = {
  featuredBlog: PropTypes.shape({
    author: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default Hero;
