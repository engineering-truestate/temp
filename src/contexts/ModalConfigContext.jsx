// contexts/ModalConfigContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const ModalConfigContext = createContext();

export const useModalConfig = () => {
  const context = useContext(ModalConfigContext);
  if (!context) {
    throw new Error('useModalConfig must be used within ModalConfigProvider');
  }
  return context;
};

const getDefaultModalConfig = () => ({
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
  }
});

export const ModalConfigProvider = ({ children }) => {
  // Initialize with default config immediately - no loading state needed
  const [modalConfig, setModalConfig] = useState(getDefaultModalConfig());
  const [isLoaded, setIsLoaded] = useState(true); // Start as true since we have defaults

  useEffect(() => {
    const docRef = doc(db, 'truestateAdmin', 'promotionalModal');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, 
      (doc) => {
        if (doc.exists()) {
          const firebaseConfig = doc.data();
          // Merge with defaults to ensure all properties exist
          setModalConfig(prevConfig => ({
            ...prevConfig,
            ...firebaseConfig
          }));
          console.log('Modal config updated from Firebase');
        } else {
          console.warn('Modal config document not found, using defaults');
        }
        setIsLoaded(true);
      },
      (error) => {
        console.error('Error fetching modal config:', error);
        // Keep using default config on error
        setIsLoaded(true);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = {
    modalConfig,
    isLoaded
  };

  return (
    <ModalConfigContext.Provider value={value}>
      {children}
    </ModalConfigContext.Provider>
  );
};