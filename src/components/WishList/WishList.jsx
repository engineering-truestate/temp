import { useNavigate } from 'react-router-dom';
import WishlistProjectGrid from '../WishlistProjectGrid';
import styles from './WishList.module.css';
import emptyImage from '../WishList/Wishlist.png';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase';

const WishList = ({ trueS, projects = [], isLoading = false }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/properties');
  };

  // Show empty state when not loading and no projects
  if (!isLoading && projects.length === 0) {
    return (
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
    );
  }

  // Show wishlist grid when not loading and has projects
  if (!isLoading && projects.length > 0) {
    return (
      <div className="pb-[48px]">
        <WishlistProjectGrid projects={projects} trueS={trueS} />
      </div>
    );
  }

  // Return null when loading (loading will be handled by MainContentLayout)
  return null;
};

export default WishList;
