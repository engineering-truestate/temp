// contexts/ModalConfigContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
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
  const [modalConfig, setModalConfig] = useState(getDefaultModalConfig());
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'truestateAdmin', 'promotionalModal');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const firebaseConfig = docSnap.data();
          setModalConfig(prevConfig => ({
            ...prevConfig,
            ...firebaseConfig
          }));
          console.log('Modal config loaded from Firebase');
        } else {
          console.warn('Modal config not found, using defaults');
        }
      } catch (error) {
        console.error('Error fetching modal config:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchConfig();
  }, []);

  return (
    <ModalConfigContext.Provider value={{ modalConfig, isLoaded }}>
      {children}
    </ModalConfigContext.Provider>
  );
};
