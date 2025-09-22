import { useState, useEffect } from "react";
import WishList from "../components/WishList/WishList";
import MainContentLayout from "../components/MainContentLayout";
import WishlistPageHeader from "../components/Headers/WishlistPageHeader";

const WishlistPage = () => {
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [isVisible, setIsVisible] = useState(window.innerWidth > 640);

  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth > 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <MainContentLayout pageTitle="Wish List">
      <WishlistPageHeader
        selectedSortOption={selectedSortOption}
        setSelectedSortOption={setSelectedSortOption}
        isVisible={isVisible}
      />
      <WishList view="grid" trueS="all" />
    </MainContentLayout>
  );
};

export default WishlistPage;