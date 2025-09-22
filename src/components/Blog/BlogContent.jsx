import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'markdown-to-jsx';
import TableOfContents from './TableofContents';
import styles from './Blog.module.css';
import imp from "../../../public/images/houseimage.png"
import MyBreadcrumb from '../BreadCrumbs/Breadcrumb.jsx';
import { useParams } from 'react-router-dom';
import blogs from '../../../public/content/blogs/blogs.js';
import Linkedin from "/assets/icons/social/linkedin.svg";

const BlogContent = () => {
  const params = useParams();
  const { blogId } = params;

  const thisBlog = blogs.find((blog) => blog.title === blogId);
  const fileName = thisBlog.contentPage;
  const [post, setPost] = useState("");
  const [headings, setHeadings] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    fetch(`/content/blogs/${fileName}`)
      .then((res) => res.text())
      .then((res) => {
        setPost(res);
      })
      .catch((err) => {});
  }, [fileName]);

  useEffect(() => {
    const extractHeadingsFromDOM = () => {
      const headings = Array.from(contentRef.current.querySelectorAll('h1, h2, h3, h4')).map((heading, index) => {
        const level = parseInt(heading.tagName.substring(1));
        const text = heading.textContent.trim();
        const id = heading.id;
        return { text, level, id };
      });
      setHeadings(headings);
    };

    if (contentRef.current) {
      extractHeadingsFromDOM();
    }
  }, [post]);

  const createId = (text) => {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  };

  const options = {
    overrides: {
      h1: {
        component: (props) => {
          const text = React.Children.toArray(props.children).join('');
          const id = createId(text);
          return (
            <h1 id={id} className={`${styles.blog_h1}  mb-5 md:mt-10 md:mb-5  `}>
              {props.children}
            </h1>
          );
        },
      },
      h2: {
        component: (props) => {
          const text = React.Children.toArray(props.children).join('');
          const id = createId(text);
          return (
            <h2 id={id} className={`${styles.blog_h2} mb-5  md:mt-10 md:mb-5 `}>
              {props.children}
            </h2>
          );
        },
      },
      h3: {
        component: (props) => {
          const text = React.Children.toArray(props.children).join('');
          const id = createId(text);
          return (
            <h3 id={id} className={`${styles.blog_h3} mb:5  md:mt-10 md:mb-5 `}>
              {props.children}
            </h3>
          );
        },
      },
      h4: {
        component: (props) => {
          const text = React.Children.toArray(props.children).join('');
          const id = createId(text);
          return (
            <h4 id={id} className={`${styles.blog_h4} mb:5  md:mt-10 md:mb-5 `}>
              {props.children}
            </h4>
          );
        },
      },
      p: {
        component: (props) => {
          return (
            <p className={`${styles.blog_p}  `}>
              {props.children}
            </p>
          );
        },
      },
      img: {
        component: (props) => {
          return (
            <img className={`${styles.blog_img}`} {...props} />
          );
        },
      },
    },
  };

  return (
    <div>
      <div className=" flex overflow-hidden overflow-y-auto">
        <div className=" lg:w-3/5 lg:ml-8 md:w-full sm:w-full  px-4 sm:px-8 lg:px-0  h-screen" ref={contentRef}>
          <div className=' mt-3 mb-3  '><MyBreadcrumb /></div>
          <p className={` ${styles.font5}  md:text-3xl    mb-3 md:mb-4 `}>
            {thisBlog.title}
          </p>

          <div className={`  mb-7 md:mb-10 flex `}><p className={`${styles.blog_h10} md:text-base `} >{thisBlog.category}</p><p className={`ml-2 mr-2 ${styles.blog_h10} md:text-base`}>|</p><p className={`ml-2 ${styles.blog_h10} md:text-base`}>{thisBlog.date}</p></div>
          <img
            src={thisBlog.blogImageUrl}
            alt="Content Image"
            className={` mb-7 md:mb-0 rounded-lg w-[100%] max-h-[60vh]`}
          />
          <Markdown options={options}>{post}</Markdown>
          <hr className='mt-10 mb-10' style={{ borderTop: 'solid 1px #E3E3E3' }} />
          <div className='  min-h-[72px] max-w-full'>
            <div className=' flex items-center pb-10  sm:my-auto  sm:mb-0'>
              <img
                src={thisBlog.authorImageUrl}
                alt="User"
                className="w-[72px] h-[72px] rounded-full mr-4 "
              />
              <a href={thisBlog.linkedinUrl} target="blank">
              <div className='flex-col  min-h-[59px] w-full'>
                <div className="flex gap-[8px] items-center">
                  <p className={` font-montserrat font-bold text-[18px] leading-[27px] text-[#000000] `}>{thisBlog.author}</p>
                  <img src={Linkedin} alt="Linkedin" />
                </div>
                <p className={` font-lato text-[16px] leading-[24px] text-[#2B2928] `}>{thisBlog.authorTitle}</p>
              </div>
              </a>
            </div>
          </div>
        </div>

        <div className="w-2/5   absolute top-[16%] lg:right-[0.1%] xl:right-[0.1%] hidden sm:hidden md:hidden lg:block  ">
          <TableOfContents headings={headings} />
        </div>
        
      </div>
    </div>

  );
};

export default BlogContent;
