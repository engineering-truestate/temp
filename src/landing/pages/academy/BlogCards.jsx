import { Link } from 'react-router-dom';

// New and improved slug generator
const generateSlug = (title) => {
  return title
    .toLowerCase()                    // Convert to lowercase
    .normalize("NFD")                 // Normalize to decompose diacritics
    .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics (e.g., accents)
    .replace(/[^a-z0-9\s-]/g, '')     // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-')             // Replace spaces with hyphens
    .replace(/-+/g, '-')              // Collapse multiple hyphens into one
    .trim()                           // Remove leading/trailing spaces
    .replace(/^-|-$/g, '');           // Remove leading/trailing hyphens
};

const BlogCards = ({ blogs }) => {
  return (
    <section className="">

            {/* Internal CSS for handling smaller screens */}
            <style>
            {`
              @media (max-width: 375px) {
                .custom-card-width {
                  width: 80%; /* Custom width for screens below 375px */
                }
              }
            `}
          </style>

      <div 
        className="container pt-0 pb-16 md:py-10 lg:py-14 sm:px-6 md:px-20 lg:px-24 grid gap-10 md:gap-6 place-items-center mx-auto"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(332px, 1fr))', // Adjust the grid's minimum column size to 332px for larger screens
          alignItems: 'stretch', // Ensure all cards stretch to the same height
        }}
      >
        {/* Loop through each blog and render a card */}
        {blogs
        .sort((a, b) => {
          const [dayA, monthA, yearA] = a.date.split('-').map(Number);
          const [dayB, monthB, yearB] = b.date.split('-').map(Number);
        
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
        
          return dateB - dateA;
        })
        .map((blog) => (
          <Link 
            to={`/insights/${encodeURIComponent(generateSlug(blog.title))}`} // Creating a slug from the title
            key={blog.id} // Use a unique key instead of index
            className="group bg-white rounded-2xl p-2.5 gap-1 transition-shadow duration-300 ease-in-out shadow-card-shadow hover:shadow-card-shadow-hover 
                       w-[332px] lg:w-[396px] mx-auto sm:w-full custom-card-width"
            aria-label={`Read more about ${blog.title}`}
          >
            {/* Blog Image */}
            <div className="w-full">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="rounded-xl w-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-90"
                style={{ aspectRatio: '16 / 9' }} 
                loading="lazy"  // Lazy load images
              />
            </div>
            
            <div className="flex flex-col gap-4 lg:gap-5 py-6 px-2 lg:py-8 md:px-3">
              
              {/* Blog Metadata (Author, Category, Date) */}
              <p className="text-heading-semibold-xxxs text-ShadedGrey font-body flex items-center gap-2.5 md:gap-3 uppercase">
                {/* Blog Category */}
                <span>{blog.category}</span>
                
                {/* Divider line */}
                <span className="flex-grow border-t border-[1px] border-ShadedGrey/20 mx-2"></span>

                {/* Date */}
                <span>{blog.date}</span>
              </p>
              
              <div className="flex flex-col gap-2.5 md:gap-3">
                
                {/* Blog Title */}
                <h3 className="text-display-xxxs md:text-display-xxs lg:text-display-xs font-heading font-bold text-GreenBlack">
                  {blog.title}
                </h3>
                
                {/* Blog Excerpt */}
                <p className="text-paragraph-sm md:text-paragraph-md lg:text-paragraph-lg font-body text-GreenBlack line-clamp-3">
                  {blog.excerpt}
                </p>
              </div>

              {/* Author Section */}
              <p className='text-heading-semibold-xxxs text-ShadedGrey font-body flex items-center gap-2.5 uppercase'>
                {/* Author Image */}
                <img src={blog.authorImage} alt={blog.author} className='h-6 md:h-7 w-6 md:w-7 rounded-full' /> 
                {/* Author Name */}
                <span>{blog.author}</span>
              </p>
              
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BlogCards;
