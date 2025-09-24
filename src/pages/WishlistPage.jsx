import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import WishList from "../components/WishList/WishList";
import MainContentLayout from "../components/MainContentLayout";
import {
  fetchWishlistedProjects,
  selectWishlistItems,
} from "../slices/wishlistSlice";
import { selectUserDocId } from "../slices/userAuthSlice";
import { showLoader, hideLoader, selectLoader } from "../slices/loaderSlice";
import Loader from "../components/Loader";
import { divIcon } from "leaflet";

const WishlistPage = () => {
  const dispatch = useDispatch();

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

  return (
    <MainContentLayout pageTitle="Wish List" showLoader={false}>
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      )}
      <WishList
        view="grid"
        trueS="all"
        projects={wishlistedProjects}
        isLoading={isLoading}
      />
    </MainContentLayout>
  );
};

export default WishlistPage;
