import PropCard from './Project_popup/ProjectPopup';
import AuctionCard from './Project_popup/AuctionPopup'
import styles from './Project_popup/ProjectPopup.module.css';
import emptyImage from "/images/emptyproppg.png";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";

const WishlistProjectGrid = ({ projects, trueS }) => {
  return (
    <>
      {(projects.length === 0) || trueS === 'true' ? (
        <div className="flex flex-col items-center justify-center h-96">
          <img
            src={emptyImage}
            alt="No projects"
            className="w-48 h-48 object-contain mb-4"
          />
          <p className={`${styles.emptyh}`}>No property available</p>
          <p className={`${styles.emptyp}`}>
          {trueS == "true" ? <span className="w-[50px]">Due to some technical issue we&apos;re unable to show the recommended properties. <br /> Please try again later!</span> : <span>Please edit your preferences and try again.</span>}
          </p>
        </div>
      ) : (
        <div
          className={` mt-6 grid ${styles.lg_custom} ${styles.md_custom} ${styles.xl_custom} sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 px-4 md:px-8 lg:px-8 relative z-1`}
        >
          {projects.filter(project => (project.showOnTruEstate ==true ||  project.auction ==true)).map((project) => (
            <div key={project.id} className="w-full">
              {project?.propertyType=='auction' ? (
                <AuctionCard project={project} onClick={() => { logEvent(analytics, "click_wishlist_prop_card") }} />) : (
              
                <PropCard project={project} onClick={() => { logEvent(analytics, "click_wishlist_prop_card") }} />)
              }            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default WishlistProjectGrid;