import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const PrivacyPolicy = () => {
  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch the Markdown file
    fetch("/content/legal/privacyPolicy.md")
      .then((response) => response.text())
      .then((text) => setMarkdownContent(text));
  }, []);

  return (
    <div className="flex-col max-w-[84rem] mx-auto text-center justify-between px-6 mt-12 sm:mt-6 pr:mt-6 ld:mt-10 mb-8">
      <ReactMarkdown
        children={markdownContent}
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 font-montserrat">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mb-4 mt-8 font-montserrat">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-l font-semibold mb-4 text-justify font-montserrat">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-justify text-base text-gray-500 mb-3 font-lato">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-7 md:pl-14 text-gray-500 mb-3 font-lato">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="text-justify mb-2 font-lato">{children}</li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-500 cursor-pointer underline font-lato"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      />
    </div>
  );
};

export default PrivacyPolicy;