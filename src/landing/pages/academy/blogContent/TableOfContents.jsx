import React, { useState, useEffect } from "react";
import styles from './Blog.module.css';

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
    <div className="lg:w-[243px] xl:w-[320px] ml-auto mr-8 border-l border-[#CCCBCB] px-5 py-4 ">
      <h2 className={`text-lg font-subheading mb-4 text-left ${styles.text1}`}>Contents</h2>
      <div className={`${styles.head1} overflow-auto`} id="toc-container">
        <ul className="list-none">
          {filteredHeadings.map((heading, index) => (
            heading.text && heading.id && (
              <li
                key={index}
                className={`${heading.level === 3 ? 'ml-4 mb-4' : 'mb-4'}`}
                style={{
                  borderLeft: heading.id === activeHeading ? '3px solid #153E3B' : 'none',
                  paddingLeft: heading.id === activeHeading ? '0px' : '0',
                }}
              >
                <a
                  href={`#${heading.id}`}
                  className={`text-gray-700 hover:text-[#153E3B] hover:underline ${heading.id === activeHeading ? 'font-bold text-[#153E3B]' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHeading(heading.id);
                  }}
                >
                  <div className="truncate ml-3 font-medium first-letter:">
                    {heading.text}
                  </div>
                </a>
              </li>
            )
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TableOfContents;
