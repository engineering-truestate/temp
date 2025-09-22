import React, { useState, useEffect } from "react";
import styles from './Blog.module.css'; // Assuming you have styles set up in Blog.module.css

function TableOfContents({ headings }) {
  const [activeHeading, setActiveHeading] = useState(''); // Track the active heading

  // Scroll to the clicked heading and update the active heading
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveHeading(id); // Set clicked heading as active
    } else {
    }
  };

  useEffect(() => {
    // Use IntersectionObserver to track headings in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id); // Set active heading when intersecting
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0.1 } // Trigger when heading is in the middle
    );

    // Observe each heading element
    const headingElements = document.querySelectorAll('h2, h3');
    headingElements.forEach((el) => observer.observe(el));

    // Cleanup observer on unmount
    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Filter to get h2 and h3 headings
  const filteredHeadings = headings.filter(heading => heading.level === 2 || heading.level === 3);

  return (
    <div className={` lg:w-[243px] xl:w-[320px] ml-auto mr-8           border-[1px] border-[#CCCBCB] px-5 py-4 rounded-md  `}>
      <h2 className={`text-lg font-bold mb-4 text-left ${styles.text1} `}>Contents</h2>
      <div className={` ${styles.head1} overflow-auto `} id="toc-container">
        <ul className="list-none ">
          {filteredHeadings.map((heading, index) => (
            <li
              key={index}
              className={`${heading.level === 3 ? 'ml-4 mb-4' : 'mb-4'} `}
              style={{
                marginLeft: heading.level === 3 ? '0px' : '0',
                whiteSpace: heading.level === 3 ? 'nowrap' : 'normal',
                overflow: heading.level === 3 ? 'hidden' : 'visible',
                textOverflow: heading.level === 3 ? 'ellipsis' : 'clip',
                borderLeft: heading.id === activeHeading ? '3px solid #153E3B' : 'none', // Highlight active heading
                paddingLeft: heading.id === activeHeading ? '0px' : '0',
              }}
            >
              <a
                href={`#${heading.id}`}
                className={`text-gray-700 hover:text-[#153E3B]  hover:underline ${heading.id === activeHeading ? 'font-bold text-[#153E3B]' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(heading.id);
                }}
              >
                <div className="truncate ml-3">
                {heading.text}
                  </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TableOfContents;
