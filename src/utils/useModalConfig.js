// utils/modalConfigHelpers.js
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

//example config
export const fullModalConfig = {
  isEnabled: true,
  delay: 7000,
  sessionStorageKey: "home_modal_shown",
  content: {
    desktop: {
      title: "Compare new launches near Bengaluru airport by",
      subtitle: "Tata, Sattva and others",
      description: "Get the complete report now",
      ctaText: "View Report",
      ctaIcon: "→"
    },
    mobile: {
      title: "Compare new launches near Bengaluru airport by Tata, Sattva and others",
      description: "Get the complete report now",
      ctaText: "View Report",
      ctaIcon: "→"
    }
  },
  styling: {
    desktop: {
      maxWidth: "639px",
      height: "344px",
      gradient: "from-[#276B32] to-[#1E4E51]",
      titleSize: "text-[36px]",
      descriptionSize: "text-[18px]",
      ctaSize: "text-[13px]"
    },
    mobile: {
      maxWidth: "87%",
      height: "420px",
      gradient: "from-[#276B32] to-[#1E4E51]",
      titleSize: "text-[22px]",
      descriptionSize: "text-[14px]",
      ctaSize: "text-[13px]"
    }
  },
  images: {
    newBadge: "/assets/icons/ui/new-badge.svg",
    closeIcon: "/assets/icons/navigation/btn-close-modal.svg",
    desktopBackground: "/assets/images/banners/landing-image-4.svg",
    mobileBackground: "/assets/images/banners/landing-image-5.svg"
  },
  navigationPath: "/new-launches",
  analyticsEvent: {
    eventName: "click_investment_report",
    eventParams: {
      Name: "front_investment_report"
    }
  },
  version: "1.0"
};


/**
 * Replace the whole config
 */
export const updateFullModalConfig = async (newConfig) => {
  try {
    const docRef = doc(db, 'truestateAdmin', 'promotionalModal');
    await updateDoc(docRef, {
      ...newConfig,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Full modal config updated');
  } catch (error) {
    console.error('❌ Error updating full modal config:', error);
    throw error;
  }
};
