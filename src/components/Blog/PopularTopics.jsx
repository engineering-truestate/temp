// src/components/PopularTopics.js

import React from 'react';
import styles from './Blog.module.css';
import { useParams } from 'react-router-dom';
import blogs from '../../../public/content/blogs/blogs.js';

const PopularTopics = ({ topic }) => {
  return (
    <div className=" rounded-lg hidden xl: ml-auto xl:ml-6 xl:mt-6 xl:pr-4 xl:block xl:w-[100%]  xl:h-auto ">
        <div className="mb-[28px] ">
          <h3 className={`${styles.blog_h6} mb-[10px] mr-12`}>{topic.title}</h3>
          <div className='flex items-center'>
          <img 
                src= {topic.authorImageUrl}
                alt="User" 
                className="w-8 h-8 rounded-full mr-2" 
              />
          <p className={`${styles.blog_h7}`}>{topic.author}</p>
          </div>
        </div>
    </div>
  );
};

export default PopularTopics;
