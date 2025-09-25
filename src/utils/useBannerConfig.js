import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// Example banner config — matches your <PromotionalBanner /> defaults
export const fullBannerConfig = {
  isVisible: true,
  content: {
    desktop: {
      title:
        "Compare new launches near Bengaluru airport by Tata, Sattva and others",
      ctaText: "View report",
      ctaIcon: "→",
    },
    mobile: {
      title:
        "Compare new launches near Bengaluru airport by Tata, Sattva and others",
      ctaText: "View Report",
      ctaIcon: "→",
    },
  },
  styling: {
    desktop: {
      height: "53px",
      gradient: "from-[#276B32] to-[#1E4E51]",
      titleSize: "text-[16px]",
      titleFont: "font-[Montserrat]",
      ctaSize: "text-[13px]",
      ctaFont: "font-[Lato]",
      borderRadius: "rounded-b-[12px]",
    },
    mobile: {
      height: "81px",
      gradient: "from-[#276B32] to-[#1E4E51]",
      titleSize: "text-[13px]",
      titleFont: "font-[Montserrat]",
      ctaSize: "text-[12px]",
      ctaFont: "font-[Lato]",
      borderRadius: "",
    },
    background: "bg-[#FAFAFA]",
    padding: "px-0 sm:px-[7.5%]",
  },
  images: {
    desktopBackground: "/assets/images/banners/build.svg",
    mobileBackground: "/assets/images/banners/building1.svg",
  },
  navigationPath: "/new-launches",
  analyticsEvent: {
    eventName: "click_investment_report",
    eventParams: {
      Name: "front_investment_report",
    },
  },
  // optional version field
  version: "1.0",
};

/**
 * Replace the whole banner config in Firestore
 */
export const updateFullBannerConfig = async (newConfig) => {
  try {
    const docRef = doc(db, 'truestateAdmin', 'promotionalBanner');
    await updateDoc(docRef, {
      ...newConfig,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Full banner config updated');
  } catch (error) {
    console.error('❌ Error updating full banner config:', error);
    throw error;
  }
};
