import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; // To get the slug from URL
import Markdown from 'markdown-to-jsx';
import TableOfContents from './TableOfContents.jsx';
import styles from './Blog.module.css';
import linkedInLogo from "../../../assets/academy/icons/linkedin-blog.svg";

import blogData from '../BlogData.jsx'; // Import blog data

const BlogContent = () => {
  const { slug } = useParams(); // Get the blog slug from the URL
  const [post, setPost] = useState(""); // Stores the blog markdown content
  const [headings, setHeadings] = useState([]); // Stores the extracted headings for TOC
  const contentRef = useRef(null); // Reference to the blog content for extracting headings

  // Find the blog object based on the slug
  const blog = blogData.find((item) => item.slug === slug);

  // Fetch the markdown file based on the blog slug and update post content
  useEffect(() => {
    if (blog) {
      fetch(`/content/markdown/${blog.mdFile}`)
        .then((res) => res.text())
        .then((res) => {
          setPost(res); // Set the blog markdown content
        })
        .catch((err) => { });
    }
  }, [blog]);

  // Extract headings from the rendered markdown content for TOC
  useEffect(() => {
    const extractHeadingsFromDOM = () => {
      // Get all heading elements (h1, h2, h3, etc.) from the rendered content
      const headings = Array.from(contentRef.current.querySelectorAll('h1, h2, h3, h4')).map((heading) => {
        const level = parseInt(heading.tagName.substring(1)); // Extract heading level (1, 2, 3...)
        const text = heading.textContent.trim(); // Extract the text inside the heading
        const id = heading.id; // Get the id of the heading (which is generated below)
        return { text, level, id }; // Return an object with text, level, and id
      });
      setHeadings(headings); // Update the state with extracted headings
    };

    if (contentRef.current) {
      extractHeadingsFromDOM(); // Extract headings after the post is rendered
    }
  }, [post]); // Re-run whenever the post content changes

  // Helper function to create a unique id from the heading text
  const createId = (text) => {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'); // Convert text to a slug-like id
  };

  // Markdown-to-JSX options to customize how headings and other elements are rendered
  const options = {
    overrides: {
      h1: {
        component: (props) => {
          const text = React.Children.toArray(props.children).join(''); // Get the text inside the h1 tag
          const id = createId(text); // Create a unique id from the text
          return (
            <h1 id={id} className={`${styles.blog_h1} mb-5 md:mt-10 md:mb-5`}>
              {props.children}
            </h1>
          );
        },
      },
      h2: {
        component: (props) => {
          const text = React.Children.toArray(props.children).join(''); // Get the text inside the h2 tag
          const id = createId(text); // Create a unique id from the text
          return (
            <h2 id={id} className={`${styles.blog_h2} mb-5 md:mt-10 md:mb-5`}>
              {props.children}
            </h2>
          );
        },
      },
      h3: {
        component: (props) => {
          const text = React.Children.toArray(props.children).join(''); // Get the text inside the h3 tag
          const id = createId(text); // Create a unique id from the text
          return (
            <h3 id={id} className={`${styles.blog_h3} mb-5 md:mt-10 md:mb-5`}>
              {props.children}
            </h3>
          );
        },
      },
      // Handling paragraphs
      p: {
        component: (props) => {
          return (
            <p className={`${styles.blog_p}`}>
              {props.children}
            </p>
          );
        },
      },
      // Handling images in the markdown content
      img: {
        component: (props) => {
          return (
            <img className={styles.blog_img} {...props} />
          );
        },
      },
    },
  };

  // If no blog is found, display a message
  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="min-h-screen flex justify-center container px-4 lg:px-24"> {/* Added padding for smaller screens */}
      {/* Table of Contents */}
      <div className="hidden lg:block w-1/4 pr-6 pb-24 lg:px-0">
        {/* Sticky Table of Contents */}
        <div className="sticky top-60"> {/* Keeps the TOC sticky on the page */}
          {/* Passing the headings to the TableOfContents component */}
          <TableOfContents headings={headings} />
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="max-w-6xl w-full flex md:px-12 lg:px-0 py-16 md:py-20 lg:py-24 justify-center lg:justify-end">
        {/* Blog Content */}
        <div className="w-full lg:w-11/12  flex flex-col gap-6 md:gap-10">

          {/* Title + details */}
          <div className="flex flex-col gap-6 lg:gap-8 items-start md:items-center">
            {/* Blog Type and Date */}
            <div className="text-center flex gap-4 items-center">
              <span className="inline-block bg-gray-200 text-ShadedGrey text-sm px-4 py-1 rounded-full">
                {blog.blogType}
              </span>
              <span className="text-gray-600 text-sm">{blog.date}</span>
            </div>

            {/* Blog Title */}
            <p className="text-left md:text-center text-display-xs md:text-display-sm lg:text-display-sm font-heading text-gray-900">
              {blog.title}
            </p>
          </div>

          {/* Blog Image */}
          <div className="w-full aspect-[718/402] mb-6"> {/* Added bottom margin for spacing */}
            <img
              src={blog.image} // Dynamic blog image
              alt="Content Image"
              className="rounded w-full object-cover"
            />
          </div>

          {/* Render the markdown content */}
          <div ref={contentRef} className="prose prose-lg mx-auto mb-8"> {/* Added bottom margin */}
            <Markdown options={options}>{post}</Markdown>
          </div>

          <hr className="border-gray-300 mb-8" /> {/* Added bottom margin for separation */}

          {/* Author Information */}
          <div className="flex items-center justify-start gap-4"> {/* Adjusted gap */}
            <img src={blog.author.image} alt="User" className="w-16 h-16 rounded-full" />
            <a href={blog.author.linkedIn} target="_blank" rel="noopener noreferrer">
              <div className="text-start">
                {/* Author Name + LinkedIn */}
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-gray-900 font-subheading">{blog.author.name}</p>
                  <img src={linkedInLogo} alt="LinkedIn Logo" className="w-5 h-5" /> {/* Adjusted icon size */}
                </div>
                {/* Author designation */}
                <p className="text-sm text-gray-800 font-body">{blog.author.role}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div >
  );
};

export default BlogContent;

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom'; // To get the slug from URL
// import TableOfContents from './TableOfContents.jsx';
// import styles from './Blog.module.css';
// import linkedInLogo from "../../../assets/academy/icons/linkedin-blog.svg";
// import { logEvent } from "firebase/analytics";
// import { analytics } from '../../../../firebase.js';

// import blogData from '../BlogData.jsx'; // Import blog data
// const BlogContent = () => {
//   const { slug } = useParams(); // Get the blog slug from the URL
//   const [headings, setHeadings] = useState([]); // Stores the extracted headings for TOC
//   const contentRef = useRef(null); // Reference to the blog content for extracting headings

//   // Find the blog object based on the slug
//   const blog = blogData.find((item) => item.slug === slug);

//   // Extract headings from the rendered content for TOC
//   useEffect(() => {
//     const extractHeadingsFromDOM = () => {
//       // Get all heading elements (h1, h2, h3, etc.) from the rendered content
//       const headings = Array.from(contentRef.current.querySelectorAll('h1, h2, h3, h4')).map((heading) => {
//         const level = parseInt(heading.tagName.substring(1)); // Extract heading level (1, 2, 3...)
//         const text = heading.textContent.trim(); // Extract the text inside the heading
//         const id = heading.id; // Get the id of the heading (which is generated below)
//         return { text, level, id }; // Return an object with text, level, and id
//       });
//       setHeadings(headings); // Update the state with extracted headings
//     };

//     if (contentRef.current) {
//       extractHeadingsFromDOM(); // Extract headings after the post is rendered
//     }
//   }, []);

//   // Helper function to create a unique id from the heading text
//   const createId = (text) => {
//     return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'); // Convert text to a slug-like id
//   };

//   // If no blog is found, display a message
//   if (!blog) {
//     return <div>Blog not found</div>;
//   }

//   return (
//     <div className="min-h-screen flex justify-center container px-4 lg:px-24"> {/* Added padding for smaller screens */}
//       {/* Table of Contents */}
//       <div className="hidden lg:block w-1/4 pr-6 pb-24 lg:px-0">
//         {/* Sticky Table of Contents */}
//         <div className="sticky top-60"> {/* Keeps the TOC sticky on the page */}
//           {/* Passing the headings to the TableOfContents component */}
//           <TableOfContents headings={headings} />
//         </div>
//       </div>

//       {/* Main Content Wrapper */}
//       <div className="max-w-6xl w-full flex md:px-12 lg:px-0 py-16 md:py-20 lg:py-24 justify-center lg:justify-end">
//         {/* Blog Content */}
//         <div className="w-full lg:w-11/12  flex flex-col gap-6 md:gap-10">

//           {/* Title + details */}
//           <div className="flex flex-col gap-6 lg:gap-8 items-start md:items-center">
//             {/* Blog Type and Date */}
//             <div className="text-center flex gap-4 items-center">
//               <span className="inline-block bg-gray-200 text-ShadedGrey text-sm px-4 py-1 rounded-full">
//                 {blog.blogType}
//               </span>
//               <span className="text-gray-600 text-sm">{blog.date}</span>
//             </div>

//             {/* Blog Title */}
//             <p className="text-left md:text-center text-display-xs md:text-display-sm lg:text-display-sm font-heading text-gray-900">
//               {blog.title}
//             </p>
//           </div>

//           {/* Blog Image */}
//           <div className="w-full aspect-[718/402] mb-6"> {/* Added bottom margin for spacing */}
//             <img
//               src={blog.blogImageUrl} // Dynamic blog image
//               alt="Content Image"
//               className="rounded w-full object-cover"
//             />
//           </div>

//           {/* Embedded Blog Content */}
//           <div ref={contentRef} className="prose prose-lg mx-auto mb-8">
//             <div>
//               <p className={`${styles.blog_p}`}>
//                 The TruEstate Pulse Report 2024 offers a detailed analysis of India's real estate sector, exploring key trends, investment opportunities, and economic factors driving growth in 2024. With a projected 9.2% CAGR from 2023 to 2028, the report covers residential, commercial, industrial, and data center market trends.
//               </p>

//               <h2 id={createId("Report Highlights")} className={`${styles.blog_h2} mb-5 md:mt-10 md:mb-5`}>
//                 Report Highlights
//               </h2>

//               <div>
//                 <p className="text-sm md:text-base lg:text-lg">
//                   <ul className="list-disc pl-4 md:pl-6 space-y-1 py-2">
//                     <li>
//                       Record-breaking $8.9 billion institutional investment, with residential leading as the top asset class.
//                     </li>
//                     <li>
//                       Strong foreign investment, especially from the Americas, boosting India's real estate landscape.
//                     </li>
//                     <li>
//                       A thriving office market fueled by the rise of Global Capability Centers (GCCs) and tech-sector demand.
//                     </li>
//                     <li>
//                       Residential demand shifting toward premium housing, with Bengaluru experiencing a notable surge in high-value sales.
//                     </li>
//                   </ul>
//                 </p>
//               </div>

//               <p className={`${styles.blog_p}`}>
//                 Download the full report to get detailed insights that help capitalize on India's growing real estate opportunities.
//               </p>

//               {/* Download Report Section */}
//               <div
//                 className="relative rounded-2xl p-4 md:p-6 flex flex-row items-center gap-4 md:gap-6 my-8"
//                 style={{backgroundColor: '#FAF1CE'}}
//               >
//                 <img
//                   src="../blogs/images/pulseReportDownloadCover.svg"
//                   alt="Pulse Report Cover"
//                   className="w-20 md:w-28 rounded shadow-sm object-cover"
//                 />

//                 <div className="z-10">
//                   <span className="text-base md:text-xl font-bold font-montserrat block mb-1">
//                     2024 Pulse Report
//                   </span>
//                   <span className="text-sm md:text-xl text-gray-700 font-lato block mb-3">
//                     Real Estate Insights and market trends
//                   </span>
//                   <a
//                     href="../blogs/TruEstate Pulse Report.pdf"
//                     target="_blank"
//                     className="inline-flex items-center gap-2 font-medium px-4 py-2 rounded-md text-white"
//                     onClick={()=>{logEvent(analytics,"click_blogs_download_report")}}
//                     style={{backgroundColor: '#153E3B'}}
//                   >
//                     <img
//                       src="../blogs/images/blogPdfDownloadIcon.svg"
//                       alt="Download Icon"
//                       className="w-4 h-4 md:w-5 md:h-5"
//                     />
//                     <span className="text-sm md:text-base whitespace-nowrap">
//                       Download Report
//                     </span>
//                   </a>
//                 </div>

//                 <img
//                   src="../blogs/images/blogBannerComponent.svg"
//                   alt="Arrows"
//                   className="absolute right-0 bottom-0 h-full z-0 hidden md:block"
//                 />
//               </div>

//               <h2 id={createId("Investment Opportunities")} className={`${styles.blog_h2} mb-5 md:mt-10 md:mb-5`}>
//                 Investment Opportunities
//               </h2>

//               <p className={`${styles.blog_p}`}>
//                 India's real estate sector continues to attract significant institutional capital, driven by favorable policies and economic growth. The residential segment has emerged as the preferred choice for investors, accounting for the majority of institutional investments in 2024.
//               </p>

//               <h3 id={createId("Key Market Drivers")} className={`${styles.blog_h3} mb-5 md:mt-10 md:mb-5`}>
//                 Key Market Drivers
//               </h3>

//               <p className={`${styles.blog_p}`}>
//                 The growth in India's real estate market is supported by several factors:
//               </p>

//               <ul className="list-disc pl-4 md:pl-6 space-y-1 py-2">
//                 <li><strong>Urbanization</strong>: Rapid urban expansion continues to drive housing demand</li>
//                 <li><strong>Economic Growth</strong>: Strong GDP growth supporting real estate investments</li>
//                 <li><strong>Policy Support</strong>: Government initiatives like RERA and GST implementation</li>
//                 <li><strong>Technology Integration</strong>: PropTech innovations transforming the sector</li>
//               </ul>

//               <h2 id={createId("Regional Analysis")} className={`${styles.blog_h2} mb-5 md:mt-10 md:mb-5`}>
//                 Regional Analysis
//               </h2>

//               <p className={`${styles.blog_p}`}>
//                 Different regions across India are experiencing varied growth patterns, with metro cities leading the charge in both residential and commercial segments.
//               </p>

//               <h3 id={createId("Bengaluru Market Dynamics")} className={`${styles.blog_h3} mb-5 md:mt-10 md:mb-5`}>
//                 Bengaluru Market Dynamics
//               </h3>

//               <p className={`${styles.blog_p}`}>
//                 Bengaluru has witnessed exceptional growth in premium housing segments, with luxury residential projects seeing unprecedented demand from both domestic and international buyers.
//               </p>

//               <h2 id={createId("Future Outlook")} className={`${styles.blog_h2} mb-5 md:mt-10 md:mb-5`}>
//                 Future Outlook
//               </h2>

//               <p className={`${styles.blog_p}`}>
//                 The real estate sector is poised for sustained growth, with emerging trends like sustainable construction, smart cities, and co-working spaces reshaping the landscape.
//               </p>

//               <h3 id={createId("Emerging Trends")} className={`${styles.blog_h3} mb-5 md:mt-10 md:mb-5`}>
//                 Emerging Trends
//               </h3>

//               <ul className="list-disc pl-4 md:pl-6 space-y-1 py-2">
//                 <li><strong>Sustainability</strong>: Green building certifications becoming standard</li>
//                 <li><strong>Technology</strong>: AI and IoT integration in property management</li>
//                 <li><strong>Flexible Spaces</strong>: Rise of co-working and flexible office solutions</li>
//                 <li><strong>Data Centers</strong>: Growing demand for digital infrastructure</li>
//               </ul>

//               <h2 id={createId("Conclusion")} className={`${styles.blog_h2} mb-5 md:mt-10 md:mb-5`}>
//                 Conclusion
//               </h2>

//               <p className={`${styles.blog_p}`}>
//                 The TruEstate Pulse Report 2024 demonstrates the resilience and growth potential of India's real estate sector. With strategic investments and policy support, the industry is well-positioned for continued expansion in the coming years.
//               </p>
//             </div>
//           </div>

//           <hr className="border-gray-300 mb-8" /> {/* Added bottom margin for separation */}

//           {/* Author Information */}
//           <div className="flex items-center justify-start gap-4"> {/* Adjusted gap */}
//             <img src={blog.author.image} alt="User" className="w-16 h-16 rounded-full" />
//             <a href={blog.author.linkedIn} target="_blank" rel="noopener noreferrer">
//               <div className="text-start">
//                 {/* Author Name + LinkedIn */}
//                 <div className="flex items-center gap-2">
//                   <p className="text-lg font-bold text-gray-900 font-subheading">{blog.author.name}</p>
//                   <img src={linkedInLogo} alt="LinkedIn Logo" className="w-5 h-5" /> {/* Adjusted icon size */}
//                 </div>
//                 {/* Author designation */}
//                 <p className="text-sm text-gray-800 font-body">{blog.author.role}</p>
//               </div>
//             </a>
//           </div>
//         </div>
//       </div>
//     </div >
//   );
// };

// export default BlogContent;