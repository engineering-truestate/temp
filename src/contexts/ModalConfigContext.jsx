// contexts/ModalConfigContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
  flag: 'launches',
});

export const ModalConfigProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState(null); // start empty
  const [isLoaded, setIsLoaded] = useState(false);

  // you can expose this default flag immediately
  const defaultFlag = 'launches';

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'truestateAdmin', 'promotionalModal');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setModalConfig(docSnap.data());
          console.log('Modal config loaded from Firebase');
        } else {
          setModalConfig(getDefaultModalConfig());
          console.warn('Modal config not found, using defaults');
        }
      } catch (error) {
        console.error('Error fetching modal config:', error);
        setModalConfig(getDefaultModalConfig());
      } finally {
        setIsLoaded(true);
      }
    };

    fetchConfig();
  }, []);

  // Update modal config in Firebase
  const updateModalConfig = async (newConfig) => {
    try {
      const docRef = doc(db, 'truestateAdmin', 'promotionalModal');
      await setDoc(docRef, newConfig, { merge: true });
      setModalConfig(newConfig); // update local state immediately
      console.log('Modal config updated in Firebase');
    } catch (error) {
      console.error('Error updating modal config:', error);
    }
  };

  return (
    <ModalConfigContext.Provider
      value={{
        modalConfig,
        isLoaded,
        updateModalConfig,
        defaultFlag // <-- always available even if modalConfig is null
      }}
    >
      {children}
    </ModalConfigContext.Provider>
  );
};
