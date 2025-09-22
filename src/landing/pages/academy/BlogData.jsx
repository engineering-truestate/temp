// src/data/blogData.jsx

// import img1 from '../../assets/academy/blogimage.webp'
import blogimg3 from '../../assets/academy/blog1.webp'
import blogimg2 from '../../assets/academy/blog2.webp'
import blogimg1 from '../../assets/academy/blog3.png';
import blogimg4 from '../../assets/academy/blog4.webp'
import blogimg5 from '../../assets/academy/blog5.webp'
import blogimg6 from '../../assets/academy/blog6.webp'
import blogimg7 from '../../assets/academy/blog7.webp'
import blogimg8 from '../../assets/academy/blog8.webp';
import blogimg10 from '../../assets/academy/blog10.png';



import authorAditya from '../../assets/academy/author-aditya.webp'
import authorDJ from '../../assets/academy/author-DJ.webp'
import authorTru from '../../assets/academy/author-truTeam.webp'
import authorAmit from '../../assets/academy/author-amit.webp'



/// Utility function to generate slug from title using hyphens for spaces
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

const LinkedinUrls = {
  dhananjay: "https://www.linkedin.com/in/dhananjay-mishra-346a7620/",
  amit: "https://www.linkedin.com/in/amit-d-5b747652/",
  aditya: "https://www.linkedin.com/in/kamathaditya/",
  truEstate: "https://www.linkedin.com/company/truestateindia/",
}

// Blog data with dynamic slug generation and LinkedIn link
const blogData = [
  {
    title: 'Evaluating early-stage risks in RE projects - Pt 2',
    blogType: 'Risk Analysis',
    date: '11 April 2024',
    author: {
      name: 'Dhananjay Mishra',
      role: 'Founder of TruEstate. Figuring out inefficiencies of real estate market in India.',
      image: authorDJ, // Can be a URL or a local image
      linkedIn: LinkedinUrls.dhananjay, // Author's LinkedIn link
    },
    image: blogimg1, // Local or remote path
    mdFile: 'evaluating-early-stage-risks-in-re-projects-pt-2.md', // Markdown file name
    slug: generateSlug('Evaluating early-stage risks in RE projects - Pt 2'), // Dynamically generate slug from title
  },
  {
    title: 'Evaluating early-stage risks in RE projects - Pt 1',
    blogType: 'Risk Analysis',
    date: '04 April 2024',
    author: {
      name: 'Aditya Kamath',
      role: 'Contributing editor at TruEstate. Curious about all things real estate.',
      image: authorAditya, // Can be a URL or a local image
      linkedIn: LinkedinUrls.aditya, // Author's LinkedIn link
    },
    image: blogimg2, // Local or remote path
    mdFile: 'evaluating-early-stage-risks-in-re-projects-pt-1.md', // Ensure this is correct and matches the actual file path 
    slug: generateSlug('Evaluating early-stage risks in RE projects - Pt 1'), // Dynamically generate slug from title
  },
  {
    title: 'The (nuanced) case for real estate investing',
    blogType: 'Macro Analysis',
    date: '27 March 2024',
    author: {
      name: 'TruEstate Team',
      role: 'Real estate investing made real easy. Make property a part of your portfolio with TruEstate.',
      image: authorTru, // Can be a URL or a local image
      linkedIn: LinkedinUrls.truEstate, // Author's LinkedIn link
    },
    image: blogimg3, // Local or remote path
    mdFile: 'the-nuanced-case-for-real-estate-investing.md', // Markdown file name
    slug: generateSlug('The (nuanced) case for real estate investing'), // Dynamically generate slug from title
  },
  {
    title: 'Introduction to Residential Real Estate Investing - 101',
    blogType: 'Investment Guide',
    date: '21 October 2024',
    author: {
      name: 'Dhananjay Mishra',
      role: 'Co-Founder, TruEstate',
      image: authorDJ, // Can be a URL or a local image
      linkedIn: LinkedinUrls.dhananjay, // Author's LinkedIn link
    },
    image: blogimg4, // Local or remote path
    mdFile: 'blog4.md', // Markdown file name
    slug: generateSlug('Introduction to Residential Real Estate Investing - 101'), // Dynamically generate slug from title
  },
  {
    title: 'How to make money by Real Estate Investing: 4 Tips for Outsized Returns',
    blogType: 'Investment Guide',
    date: '26 October 2024',
    author: {
      name: 'Amit Daga',
      role: 'Co-Founder, TruEstate',
      image: authorAmit, // Can be a URL or a local image
      linkedIn: LinkedinUrls.amit, // Author's LinkedIn link
    },
    image: blogimg5, // Local or remote path
    mdFile: 'blog5.md', // Markdown file name
    slug: generateSlug('How to make money by Real Estate Investing: 4 Tips for Outsized Returns'), // Dynamically generate slug from title
  },
  {
    title: 'How Indian Real Estate is different',
    blogType: 'Market Analysis',
    date: '30 October 2024',
    author: {
      name: 'Dhananjay Mishra',
      role: 'Co-Founder, TruEstate',
      image: authorDJ, // Can be a URL or a local image
      linkedIn: LinkedinUrls.dhananjay, // Author's LinkedIn link
    },
    image: blogimg6, // Local or remote path
    mdFile: 'blog6.md', // Markdown file name
    slug: generateSlug('How Indian Real Estate is different'), // Dynamically generate slug from title
  },
  {
    title: 'A comprehensive guide to buying a house in Bengaluru',
    blogType: 'Legal and Regulations',
    date: '4 November 2024',
    author: {
      name: 'Amit Daga',
      role: 'Co-Founder, TruEstate',
      image: authorAmit, // Can be a URL or a local image
      linkedIn: LinkedinUrls.amit, // Author's LinkedIn link
    },
    image: blogimg7, // Local or remote path
    mdFile: 'blog7.md', // Markdown file name
    slug: generateSlug('A comprehensive guide to buying a house in Bengaluru'), // Dynamically generate slug from title
  },
  {
    title: 'Exit Strategies in Real Estate',
    blogType: 'Investment Guide',
    date: '22 January 2025',
    author: {
      name: 'Dhananjay Mishra',
      role: 'Founder of TruEstate. Figuring out inefficiencies of real estate market in India.',
      image: authorDJ, // Can be a URL or a local image
      linkedIn: LinkedinUrls.dhananjay, // Author's LinkedIn link
    },
    image: blogimg8, // Local or remote path,
    mdFile: 'blog8.md',
    slug: generateSlug('Exit Strategies in Real Estate'), // Dynamically generate slug from title
  },
  // Add more blogs as needed
  {
    title: 'Rental Yield - Semi-Furnished vs Fully Furnished Home',
    blogType: 'Investment Guide',
    date: '15 March 2025',
    author: {
      name: 'Dhananjay Mishra',
      role: 'Founder of TruEstate. Figuring out inefficiencies of real estate market in India.',
      image: authorDJ, // Can be a URL or a local image
      linkedIn: LinkedinUrls.dhananjay, // Author's LinkedIn link
    },
    image: blogimg1, // Local or remote path
    mdFile: 'blog9.md',
    slug: generateSlug('Rental Yield - Semi-Furnished vs Fully Furnished Home'), // Dynamically generate slug from title
  },
  {
    title: '2024 Pulse Report',
    blogType: 'Pulse Report',
    date: '18 June 2025',
    author: {
      name: 'Dhananjay Mishra',
      role: 'Founder of TruEstate. Figuring out inefficiencies of real estate market in India.',
      image: authorDJ, // Can be a URL or a local image
      linkedIn: LinkedinUrls.dhananjay, // Author's LinkedIn link
    },
    image: blogimg10, // Local or remote path
    mdFile: '2024PulseReport.md', // Markdown file name
    slug: generateSlug('2024-pulse-report'), // Dynamically generate slug from title
  },
];

export default blogData;
