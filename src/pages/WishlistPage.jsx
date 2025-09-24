import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MainContentLayout from "../components/MainContentLayout";
import WishlistProjectGrid from "../components/WishlistProjectGrid";
import Loader from "../components/Loader";
import emptyImage from "../components/WishList/Wishlist.png";
import styles from "../components/WishList/WishList.module.css";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";

import {
  fetchWishlistedProjects,
  selectWishlistItems,
} from "../slices/wishlistSlice";
import { selectUserDocId } from "../slices/userAuthSlice";
import { showLoader, hideLoader, selectLoader } from "../slices/loaderSlice";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDocId = useSelector(selectUserDocId);
  const wishlistedProjects = useSelector(selectWishlistItems);
  const isLoading = useSelector(selectLoader);

  useEffect(() => {
    if (userDocId) {
      dispatch(showLoader());
      dispatch(fetchWishlistedProjects(userDocId)).finally(() =>
        dispatch(hideLoader())
      );
    }
  }, [dispatch, userDocId]);

  const handleGoToProperties = () => {
    navigate("/properties");
    logEvent(analytics, "clicked_wishlist_go_properties", {
      Name: "wishlist_go_properties",
    });
  };

  return (
    <MainContentLayout pageTitle="Wish List" showLoader={false}>
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      )}

      {!isLoading && wishlistedProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <img
            src={emptyImage}
            alt="No Projects"
            className={styles.emptyImage}
          />
          <div className={styles.emptyContent}>
            <div className={styles.secondarydiv}>
              <h2 className={styles.projname}>No Projects Added Currently</h2>
              <p className={styles.tertiarydiv}>
                Add a project to your wishlist
              </p>
            </div>
            <button
              onClick={handleGoToProperties}
              className={styles.emptyButton}
            >
              Go to Properties Page
            </button>
          </div>
        </div>
      )}

      {!isLoading && wishlistedProjects.length > 0 && (
        <div className="pb-[48px]">
          <WishlistProjectGrid projects={wishlistedProjects} trueS="all" />
        </div>
      )}
    </MainContentLayout>
  );
};

export default WishlistPage;
