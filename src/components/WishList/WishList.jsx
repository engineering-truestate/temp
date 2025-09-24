import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import trueStateIcon from "../../../public/assets/icons/ui/truestateIcon.svg";

import WishlistProjectGrid from '../WishlistProjectGrid';
import styles from './WishList.module.css';
import { fetchWishlistedProjects, selectWishlistItems } from '../../slices/wishlistSlice';
import { selectUserPhoneNumber } from '../../slices/userAuthSlice';
import { showLoader, hideLoader, selectLoader } from '../../slices/loaderSlice';
import emptyImage from '../WishList/Wishlist.png';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase';

// Modular Loader component
const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="text-center">
      <div className="relative mx-auto mb-4 h-16 w-16">
        <div className="animate-spin rounded-full h-full w-full border-4 border-green-900 border-t-transparent border-l-transparent"></div>
        <img
          src={trueStateIcon}
          alt="Logo"
          className="absolute inset-0 m-auto h-8 w-8"
        />
      </div>
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
};

const WishList = ({ trueS }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userPhoneNumber = useSelector(selectUserPhoneNumber);
  const wishlistedProjects = useSelector(selectWishlistItems);
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
    <div className="relative min-h-[60vh]">
      {/* Loader overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <Loader text="Loading your wishlist..." />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && wishlistedProjects.length === 0 && (
        <div className={`text-center py-20 ${styles.emptyPageDiv}`}>
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
      )}

      {/* Wishlist Grid */}
      {!isLoading && wishlistedProjects.length > 0 && (
        <div className="pb-[48px]">
          <WishlistProjectGrid projects={wishlistedProjects} trueS={trueS} />
        </div>
      )}
    </div>
  );
};

export default WishList;
