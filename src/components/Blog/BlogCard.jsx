import React from 'react';
import styles from './Blog.module.css';
import imp from "../../../public/images/houseimage.png"

const BlogCard = ({ blog }) => {
  return (
    <div className="  flex flex-col h-[60%] sm:flex-row  border-b-2  mb-4 pb-4 md:pb-6 md:mb-6 ">

      <div className='  flex items-center w-full  sm:max-w-[192px]  mr-7 '>
        <img src={blog.blogImageUrl} alt="blog" className="rounded-lg md:mr-4 w-full  aspect-[5/3]" />
      </div>
      <div className="flex flex-col justify-between ">
        <div>
          <div className={` flex justify-between gap-2 mt-4 mb-2 w-fit md:mt-0 ${styles.text0}  `}>
            <p className={` ${styles.text0}`}>{blog.category}</p>
            <p>|</p>
            <p className={` ${styles.text0}`}>{blog.date}</p>
          </div>
          <h2 className={`  ${styles.text11}  md:mt-0 md:mb-1  line-clamp-1`}>{blog.title}</h2>
          <p className={`  ${styles.text3} mt-2  md:mt-0  md:mb-4 line-clamp-1 `}>{blog.content}</p>
        </div>
        <div className=' flex items-center mt-5  sm:my-auto  sm:mb-0'>
          <img
            src={blog.authorImageUrl}
            alt="User"
            className="w-7 h-7 rounded-full mr-2 "
          />
          <p className={`${styles.text10} `}>{blog.author}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
