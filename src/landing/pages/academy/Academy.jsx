import Hero from '../academy/FeaturedHero';
import BlogCards from '../academy/BlogCards';


// Blog images from public assets
const blogimg1 = '/assets/shared/images/blog/blog1.webp';
const blogimg2 = '/assets/shared/images/blog/blog2.webp';
const blogimg3 = '/assets/shared/images/blog/blog3.png';
const blogimg4 = '/assets/shared/images/blog/blog4.webp';
const blogimg5 = '/assets/shared/images/blog/blog5.webp';
const blogimg6 = '/assets/shared/images/blog/blog6.webp';
const blogimg7 = '/assets/shared/images/blog/blog7.webp';
const blogimg8 = '/assets/shared/images/blog/blog8.webp';
const blogimg9 = '/content/blogs/images/blog9.png'; // Updated path
const blogimg10 = '/assets/shared/images/blog/blog10.png';




// Author images from public assets
const authorAditya = '/assets/shared/images/blog/author-aditya.webp';
const authorDJ = '/assets/shared/images/blog/author-dj.webp';
const authorTru = '/assets/shared/images/blog/author-truTeam.webp';
const authorAmit = '/assets/shared/images/blog/author-amit.webp';

const Academy = () => {

  const featuredBlog = {
    title: '2024 Pulse Report',
      author: 'Dhananjay Mishra',
      category: 'Pulse Report',
      date: '6-18-2025',
      excerpt: 'The 2024 Pulse Report is a comprehensive analysis of the Indian real estate market, providing insights into trends, challenges, and opportunities for investors.',
      link: '/insights/2024-pulse-report',
      image: blogimg10,
      authorImage: authorDJ,
  };

  const blogs = [
    {
      title: 'Rental Yield - Semi-Furnished vs Fully Furnished Home',
      author: 'Dhananjay Mishra',
      category: 'Investment Guide',
      date: '15-03-2025',
      excerpt: 'Explore our in-depth guide that explains the different kinds of strategies real estate investors use',
      link: '/insights/rental-yield-semi-furnished-vs-fully-furnished-home',
      image: blogimg9,
      authorImage: authorDJ,
    },
    {
      title: 'Evaluating early-stage risks in RE projects - Pt 2',
      author: 'Dhananjay Mishra',
      category: 'Risk Analysis',
      date: '11-04-2024',
      excerpt: 'In Part 2, we explore how micro-markets around real estate projects influence property prices. Key factors include infrastructure, demographics, commercial developments Bengaluru means residents tend to pay a premium for areas unaffected (or less affected) by these issues.',
      link: '/insights/evaluating-early-stage-risks-in-re-projects-pt-2',
      image: blogimg3,
      authorImage: authorDJ,
    },
    {
      title: 'Evaluating early-stage risks in RE projects - Pt 1',
      author: 'Aditya Kamath',
      category: 'Risk Analysis',
      date: '04-04-2024',
      excerpt: 'In Part 1 of this article, we explore the risks of investing in early-stage real estate projects, focusing on developer-related issues. From financial solvency and regulatory challenges to construction quality and project-related infrastructure, understanding these risks is key to making informed decisions. We cover how to identify red flags such as cash flow problems, land disputes, and delays in promised amenities. Stay tuned for Part 2 and 3',
      link:'/insights/evaluating-early-stage-risks-in-re-projects-pt-1',
      image: blogimg2,
      authorImage: authorAditya,
    },
    {
      title: 'The (nuanced) case for real estate investing',
      author: 'TruEstate Team',
      category: 'Risk Analysis',
      date: '27-03-2024',
      excerpt: 'Real estate investments often result in either exceptional gains or disappointing delays. Despite the risks, real estate offers the highest risk-adjusted returns compared to other asset classes, especially for those capable of larger investments.India’s economic growth, combined with a rising working-age population and smaller households, is set to drive demand for residential property. With projected GDP growth and increasing discretionary income, real estate stands as a promising long-term investment.',
      link: '/insights/the-nuanced-case-for-real-estate-investing',
      image: blogimg1,
      authorImage: authorTru,
    },
    {
      title: 'Introduction to Residential Real Estate Investing - 101',
      author: 'Dhananjay Mishra',
      category: 'Investment Guide',
      date: '21-10-2024',
      excerpt: 'Understand the basics of residential real estate investing, along with key strategies, risks, and considerations.',
      link: '/insights/introduction-to-residential-real-estate-investing-101',
      image: blogimg4,
      authorImage: authorDJ,
    },
    {
      title: 'How to make money by Real Estate Investing: 4 Tips for Outsized Returns',
      author: 'Amit Daga',
      category: 'Investment Guide',
      date: '26-10-2024',
      excerpt: 'Real estate in India can potentially offer high returns, but only 1 in 3 investors outperform FD rates. Here’s how to avoid common investment mistakes.',
      link: '/insights/how-to-make-money-by-real-estate-investing:-4-tips-for-outsized-returns',
      image: blogimg5,
      authorImage: authorAmit,
    },
    {
      title: 'How Indian Real Estate is different',
      author: 'Dhananjay Mishra',
      category: 'Market Analysis',
      date: '30-10-2024',
      excerpt: 'Real estate in India holds strong economic and cultural value, but investment analysis differs from developed markets.',
      link: '/insights/how-indian-real-estate-is-different',
      image: blogimg6,
      authorImage: authorDJ,
    },
    {
      title: 'A comprehensive guide to buying a house in Bengaluru',
      author: 'Amit Daga',
      category: 'Legal and Regulations',
      date: '4-11-2024',
      excerpt: 'If you’re looking to invest in an under-construction property in Bengaluru - this guide helps you understand all the steps involved - from planning to possession.',
      link: '/insights/a-comprehensive-guide-to-buying-a-house-in-bengaluru',
      image: blogimg7,
      authorImage: authorAmit,
    },
    {
      title: '2024 Pulse Report',
      author: 'Dhananjay Mishra',
      category: 'Pulse Report',
      date: '6-18-2025',
      excerpt: 'The 2024 Pulse Report is a comprehensive analysis of the Indian real estate market, providing insights into trends, challenges, and opportunities for investors.',
      link: '/insights/2024-pulse-report',
      image: blogimg10,
      authorImage: authorDJ,
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Content is placed above the background image */}
      <div className="relative z-10">
        <Hero featuredBlog={featuredBlog} />
        <BlogCards blogs={blogs} />
      </div>
    </div>
  );
};

export default Academy;
