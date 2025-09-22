import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import WishlistProjectGrid from '../WishlistProjectGrid';
import Loader from '../Loader';
import styles from './WishList.module.css';
import { fetchWishlistedProjects, selectWishlistItems } from '../../slices/wishlistSlice';
import { selectUserPhoneNumber } from '../../slices/userAuthSlice';
import { showLoader, hideLoader, selectLoader } from '../../slices/loaderSlice';
import emptyImage from '../WishList/Wishlist.png';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase';

const WishList = ({ trueS }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userPhoneNumber = useSelector(selectUserPhoneNumber);
  const wishlistedProjects = useSelector(selectWishlistItems);

  console.log(wishlistedProjects, "wishlistedProjects");
  const isLoading = useSelector(selectLoader);

  const handleButtonClick = () => {
    navigate('/properties');
  };

  useEffect(() => {
    if (userPhoneNumber) {
      dispatch(showLoader());
      dispatch(fetchWishlistedProjects(userPhoneNumber))
        .finally(() => dispatch(hideLoader()));
    }
  }, [dispatch, userPhoneNumber]);

  return (
    <>
      <Loader />
      {!isLoading && wishlistedProjects.length === 0 ? (
        <div className={`fixed top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 ${styles.emptyPageDiv}`}>
          <img src={emptyImage} alt="No Projects" className={styles.emptyImage} />
          <div className={styles.emptyContent}>
            <div className={styles.secondarydiv}>
              <h2 className={styles.projname}>No Projects Added Currently</h2>
              <p className={styles.tertiarydiv}>Add a project to your wishlist</p>
            </div>
            <button
              onClick={() => {
                handleButtonClick();
                logEvent(analytics, 'clicked_wishlist_go_properties', { Name: 'wishlist_go_properties' });
              }}
              className={styles.emptyButton}
            >
              Go to Properties Page
            </button>
          </div>
        </div>
      ) : (
        !isLoading && (
          <div className="pb-[48px]">
            <WishlistProjectGrid projects={wishlistedProjects} trueS={trueS} />
          </div>
        )
      )}
    </>
  );
};

export default WishList;
