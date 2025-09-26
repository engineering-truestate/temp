// src/data/blogsData.js

// Blog images
import blog1 from "../../../public/content/blogs/images/blog1.webp";
import blog2 from "../../../public/content/blogs/images/blog2.webp";
import blog3 from "../../../public/content/blogs/images/blog3.webp";
import blog4 from "../../../public/content/blogs/images/blog4.webp";
import blog5 from "../../../public/content/blogs/images/blog5.webp";
import blog6 from "../../../public/content/blogs/images/blog6.webp";
import blog7 from "../../../public/content/blogs/images/blog7.webp";
import blog8 from "../../../public/content/blogs/images/blog8.webp";
import blog9 from "../../../public/content/blogs/images/blog9.png";
import blog10 from "../blogs/images/blog10.webp";

// Author images
import dj from "../../../public/content/blogs/images/dhananjay.webp";
import aditya from "../../../public/content/blogs/images/aditya.webp";
import amit from "../../../public/content/blogs/images/amit.webp";
import truestateLogo from "../../../public/content/blogs/images/truestateLogo.webp";

// LinkedIn URLs
export const LinkedinUrls = {
  dhananjay: "https://www.linkedin.com/in/dhananjay-mishra-346a7620/",
  amit: "https://www.linkedin.com/in/amit-d-5b747652/",
  aditya: "https://www.linkedin.com/in/kamathaditya/",
  truEstate: "https://www.linkedin.com/company/truestateindia/",
};

// Unified blogs array
const blogs = [
  {
    id: 10,
    category: "Pulse Report",
    date: "18 June 2025",
    title: "2024 Pulse Report",
    excerpt:
      "The 2024 Pulse Report is a comprehensive analysis of the Indian real estate market, providing insights into trends, challenges, and opportunities for investors.",
    blogImageUrl: blog10,
    author: "Dhananjay Mishra",
    authorTitle: "Co-Founder, TruEstate",
    authorImageUrl: dj,
    linkedinUrl: LinkedinUrls.dhananjay,
    contentPage: "2024PulseReport.md",
    link: "/insights/2024-pulse-report",
    isPopular: true,
  },
  {
    id: 9,
    category: "Investment Guide",
    date: "15 March 2025",
    title: "Rental Yield - Semi-Furnished vs Fully Furnished Home",
    excerpt:
      "Explore our in-depth guide that explains the different kinds of strategies real estate investors use",
    blogImageUrl: blog9,
    author: "Dhananjay Mishra",
    authorTitle: "Co-Founder, TruEstate",
    authorImageUrl: dj,
    linkedinUrl: LinkedinUrls.dhananjay,
    contentPage: "blog9.md",
    link: "/insights/rental-yield-semi-furnished-vs-fully-furnished-home",
    isPopular: true,
  },
  {
    id: 8,
    category: "Investment Guide",
    date: "22 January 2025",
    title: "Exit Strategies in Real Estate",
    excerpt:
      "Explore our in-depth guide that explains the different kinds of strategies real estate investors use",
    blogImageUrl: blog8,
    author: "Dhananjay Mishra",
    authorTitle: "Co-Founder, TruEstate",
    authorImageUrl: dj,
    linkedinUrl: LinkedinUrls.dhananjay,
    contentPage: "blog8.md",
    isPopular: true,
  },
  {
    id: 7,
    category: "Legal and Regulations",
    date: "4 November 2024",
    title: "A comprehensive guide to buying a house in Bengaluru",
    excerpt:
      "If you’re looking to invest in an under-construction property in Bengaluru - this guide helps you understand all the steps involved - from planning to possession.",
    blogImageUrl: blog7,
    author: "Amit Daga",
    authorTitle: "Co-Founder, TruEstate",
    authorImageUrl: amit,
    linkedinUrl: LinkedinUrls.amit,
    contentPage: "blog7.md",
    link: "/insights/a-comprehensive-guide-to-buying-a-house-in-bengaluru",
    isPopular: true,
  },
  {
    id: 6,
    category: "Market Analysis",
    date: "30 October 2024",
    title: "How Indian Real Estate is different",
    excerpt:
      "Real estate in India holds strong economic and cultural value, but investment analysis differs from developed markets.",
    blogImageUrl: blog6,
    author: "Dhananjay Mishra",
    authorTitle: "Co-Founder, TruEstate",
    authorImageUrl: dj,
    linkedinUrl: LinkedinUrls.dhananjay,
    contentPage: "blog6.md",
    link: "/insights/how-indian-real-estate-is-different",
  },
  {
    id: 5,
    category: "Investment Guide",
    date: "26 October 2024",
    title:
      "How to make money by Real Estate Investing: 4 Tips for Outsized Returns",
    excerpt:
      "Real estate in India can potentially offer high returns, but only 1 in 3 investors outperform FD rates. Here’s how to avoid common investment mistakes.",
    blogImageUrl: blog5,
    author: "Amit Daga",
    authorTitle: "Co-Founder, TruEstate",
    authorImageUrl: amit,
    linkedinUrl: LinkedinUrls.amit,
    contentPage: "blog5.md",
    link: "/insights/how-to-make-money-by-real-estate-investing-4-tips-for-outsized-returns",
    isPopular: true,
  },
  {
    id: 4,
    category: "Investment Guide",
    date: "21 October 2024",
    title: "Introduction to Residential Real Estate Investing - 101",
    excerpt:
      "Understand the basics of residential real estate investing, along with key strategies, risks, and considerations.",
    blogImageUrl: blog4,
    author: "Dhananjay Mishra",
    authorTitle: "Co-Founder, TruEstate",
    authorImageUrl: dj,
    linkedinUrl: LinkedinUrls.dhananjay,
    contentPage: "blog4.md",
    link: "/insights/introduction-to-residential-real-estate-investing-101",
  },
  {
    id: 3,
    category: "Risk Analysis",
    date: "11 April 2024",
    title: "Evaluating early-stage risks in RE projects - Pt 2",
    excerpt:
      "In Part 2, we explore how micro-markets around real estate projects influence property prices. Key factors include infrastructure, demographics, commercial developments.",
    blogImageUrl: blog3,
    author: "Dhananjay Mishra",
    authorTitle: "Co-Founder, TruEstate",
    authorImageUrl: dj,
    linkedinUrl: LinkedinUrls.dhananjay,
    contentPage: "blog3.md",
  },
  {
    id: 2,
    category: "Risk Analysis",
    date: "4 April 2024",
    title: "Evaluating early-stage risks in RE projects - Pt 1",
    excerpt:
      "In Part 1 of this article, we explore the risks of investing in early-stage real estate projects, focusing on developer-related issues.",
    blogImageUrl: blog2,
    author: "Aditya Kamath",
    authorTitle: "Contributing editor at TruEstate",
    authorImageUrl: aditya,
    linkedinUrl: LinkedinUrls.aditya,
    contentPage: "blog2.md",
    link: "/insights/evaluating-early-stage-risks-in-re-projects-pt-1",
  },
  {
    id: 1,
    category: "Macro Analysis",
    date: "27 March 2024",
    title: "The (nuanced) case for real estate investing",
    excerpt:
      "Real estate investments often result in either exceptional gains or disappointing delays. Despite the risks, real estate offers the highest risk-adjusted returns compared to other asset classes.",
    blogImageUrl: blog1,
    author: "TruEstate Team",
    authorTitle: "Real estate investing made real easy",
    authorImageUrl: truestateLogo,
    linkedinUrl: LinkedinUrls.truEstate,
    contentPage: "blog1.md",
    link: "/insights/the-nuanced-case-for-real-estate-investing",
  },
];

// Featured blog (pick the most popular or first one)
export const featuredBlog = blogs[0];

export default blogs;
