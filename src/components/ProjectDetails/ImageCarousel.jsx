import React, { useState, useEffect, useRef } from 'react';
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from '../../firebase';
import { fetchAllProjectsAtOnce, fetchProjectById } from '../../slices/projectSlice';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { getCurrentDateTime } from "../helper/dateTimeHelpers";
import ListIconLeft from '/assets/icons/ui/info.svg';
import ListIconRight from '/assets/icons/ui/info.svg';
import { useDispatch } from 'react-redux';
import { fetchInitialProjects } from '../../slices/projectSlice'; // Import the fetchProjects action


const ImageCarousel = ({ images, projectId }) => {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [localImages, setLocalImages] = useState(images); // To manage UI updates after deletion
  const imgRefs = useRef([]);
  const thumbnailScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);


  const logImageLoad = (index) => {
    const timestamp = getCurrentDateTime();
  };

  const handleThumbnailScroll = () => {
    const scrollLeftPos = thumbnailScrollRef.current.scrollLeft;
    const maxScrollLeft = thumbnailScrollRef.current.scrollWidth - thumbnailScrollRef.current.clientWidth;
    setCanScrollLeft(scrollLeftPos > 0);
    setCanScrollRight(scrollLeftPos < maxScrollLeft - 2);
  };

  const deleteImage = async (imageUrl) => {
    try {
      const projectDocRef = doc(db, "assetData", projectId);
      await updateDoc(projectDocRef, {
        images: arrayRemove(imageUrl),
      });


      // Update local images state to remove the deleted image
      setLocalImages(localImages.filter((image) => image !== imageUrl));
      dispatch(fetchAllProjectsAtOnce());

    } catch (error) {
    }
  };

  const scrollLeft = () => {
    thumbnailScrollRef.current.scrollBy({ left: -150, behavior: 'smooth' });
  };

  const scrollRight = () => {
    thumbnailScrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy-img');
          observer.unobserve(img);
        }
      });
    });

    // Apply observer to all images except the first one
    imgRefs.current.slice(1).forEach((img) => {
      if (img) observer.observe(img);
    });

    return () => {
      imgRefs.current.slice(1).forEach((img) => {
        if (img) observer.unobserve(img);
      });
    };
  }, []);

  useEffect(() => {
    handleThumbnailScroll();
    const ref = thumbnailScrollRef.current;
    ref?.addEventListener('scroll', handleThumbnailScroll);
    return () => {
      ref?.removeEventListener('scroll', handleThumbnailScroll);
    };
  }, []);

  return (
    <div className="relative">
      <Carousel
        selectedItem={selectedImage}
        onChange={(index) => setSelectedImage(index)}
        showThumbs={false}
        showStatus={false}
        showArrows={false}
        showIndicators={false}
      >
        {/* {images.map((image, index) => ( */}
        {localImages.map((image, index) => (

          <div
            key={index}
            className="relative w-full h-[200px] md:h-[360px] flex items-center justify-center border border-[#CCCBCB]  "
          >
            {/* <button
              onClick={() => deleteImage(image)}
              className=" right-2 bg-red-500 text-white px-2 py-1 rounded-full z-10"
            >
              Delete
            </button> */}
            {images?.length > 0 ?
              <div
                className="absolute inset-0 z-0 bg-center bg-cover blur-xl"
                style={{
                  backgroundImage: `url(${image})`,
                  filter: "blur(20px)",
                }}
              ></div>
              :
              <div
                className="absolute inset-0 z-0 bg-center bg-cover blur-xl bg-white"
                style={{
                  // backgroundImage: `url(${image})`,
                  filter: "blur(20px)",
                }}
              ></div>
            }
            <img
              src={index === 0 ? image : undefined}
              fetchPriority={index == 0 ? "high" : "low"}
              data-src={index !== 0 ? image : undefined}
              loading={index === 0 ? "eager" : "lazy"}
              alt={`Slide ${index}`}
              className="relative object-contain h-full w-auto rounded-lg lazy-img"
              ref={(el) => (imgRefs.current[index] = el)}
              onLoad={() => logImageLoad(index)}
            />


          </div>
        ))}
      </Carousel>

      {/* Thumbnails with Scroll Buttons */}
      <div className="relative mt-4 mb-6 sm:mb-9 lg:mb-14 ">
        {canScrollLeft && (
          <button onClick={scrollLeft} className="absolute left-[-5px] top-1/2 transform -translate-y-1/2 z-[9] ">
            <img src={ListIconLeft} alt="Scroll Left" className='h-[57px]' />
          </button>
        )}
        <div
          ref={thumbnailScrollRef}
          className="flex gap-3 overflow-x-auto whitespace-nowrap  w-full "
        >
          {/* {images.map((image, index) => ( */}
          {localImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`border-2 rounded-lg ${selectedImage === index ? 'border-gray-800' : 'border-transparent'}`}
              style={{ flexShrink: 0 }}
            >
              <img

                data-src={image} // Lazy load others
                loading={index === 0 ? "eager" : "lazy"} // Eager load the first thumbnail
                alt={`Thumbnail ${index}`}
                className={`rounded-md w-12 h-12 object-cover lazy-img ${selectedImage === index ? 'opacity-100' : 'opacity-50'}`}
                ref={(el) => (imgRefs.current[index + images.length] = el)}
                onLoad={() => logImageLoad(index)}
              />
            </button>
          ))}
        </div>
        {canScrollRight && (
          <button onClick={scrollRight} className="absolute right-[-5px] top-1/2 transform -translate-y-1/2 z-[9]">
            <img src={ListIconRight} alt="Scroll Right" className='h-[57px]' />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;
