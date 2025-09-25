// utils/modalConfigHelpers.js
import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
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
 * Initialize modal config document (run once if document is missing)
 */
export const initializeModalConfig = async () => {
  const initialConfig = {
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
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    version: "1.0"
  };

  try {
    const docRef = doc(db, 'truestateAdmin', 'promotionalModal');
    await setDoc(docRef, initialConfig);
    console.log('✅ Modal config initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing modal config:', error);
    throw error;
  }
};

/**
 * Toggle modal visibility
 */
export const toggleModal = async () => {
  try {
    const docRef = doc(db, 'truestateAdmin', 'promotionalModal');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentData = docSnap.data();
      await updateDoc(docRef, {
        isEnabled: !currentData.isEnabled,
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Modal toggled → ${!currentData.isEnabled ? 'ENABLED' : 'DISABLED'}`);
      return !currentData.isEnabled;
    }
  } catch (error) {
    console.error('❌ Error toggling modal:', error);
    throw error;
  }
};

/**
 * Update delay
 */
export const updateModalDelay = async (newDelay) => {
  try {
    const docRef = doc(db, 'truestateAdmin', 'promotionalModal');
    await updateDoc(docRef, {
      delay: newDelay,
      updatedAt: serverTimestamp()
    });
    console.log(`✅ Modal delay updated to ${newDelay}ms`);
  } catch (error) {
    console.error('❌ Error updating modal delay:', error);
    throw error;
  }
};

/**
 * Update content (desktop & mobile)
 */
export const updateModalContent = async (newContent) => {
  try {
    const docRef = doc(db, 'truestateAdmin', 'promotionalModal');
    await updateDoc(docRef, {
      content: newContent,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Modal content updated');
  } catch (error) {
    console.error('❌ Error updating modal content:', error);
    throw error;
  }
};

/**
 * Update styling
 */
export const updateModalStyling = async (newStyling) => {
  try {
    const docRef = doc(db, 'truestateAdmin', 'promotionalModal');
    await updateDoc(docRef, {
      styling: newStyling,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Modal styling updated');
  } catch (error) {
    console.error('❌ Error updating modal styling:', error);
    throw error;
  }
};

/**
 * Update navigation path
 */
export const updateNavigationPath = async (newPath) => {
  try {
    const docRef = doc(db, 'truestateAdmin', 'promotionalModal');
    await updateDoc(docRef, {
      navigationPath: newPath,
      updatedAt: serverTimestamp()
    });
    console.log(`✅ Navigation path updated to ${newPath}`);
  } catch (error) {
    console.error('❌ Error updating navigation path:', error);
    throw error;
  }
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
