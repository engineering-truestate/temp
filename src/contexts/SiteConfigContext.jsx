import { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

/* ---------- Default Configs ---------- */

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
    desktop: { maxWidth: "639px", height: "344px", gradient: "from-[#276B32] to-[#1E4E51]", titleSize: "text-[36px]", descriptionSize: "text-[18px]", ctaSize: "text-[13px]" },
    mobile: { maxWidth: "87%", height: "420px", gradient: "from-[#276B32] to-[#1E4E51]", titleSize: "text-[22px]", descriptionSize: "text-[14px]", ctaSize: "text-[13px]" }
  },
  images: { newBadge: "/assets/icons/ui/new-badge.svg", closeIcon: "/assets/icons/navigation/btn-close-modal.svg", desktopBackground: "/assets/images/banners/landing-image-4.svg", mobileBackground: "/assets/images/banners/landing-image-5.svg" },
  navigationPath: "/new-launches",
  analyticsEvent: { eventName: "click_investment_report", eventParams: { Name: "front_investment_report" } },
  flag: 'launches',
});

const getDefaultBannerConfig = () => ({
  isVisible: true,
  content: {
    desktop: { title: "Compare new launches near Bengaluru airport by Tata, Sattva and others", ctaText: "View report", ctaIcon: "→" },
    mobile: { title: "Compare new launches near Bengaluru airport by Tata, Sattva and others", ctaText: "View Report", ctaIcon: "→" },
  },
  styling: {
    desktop: { height: "53px", gradient: "from-[#276B32] to-[#1E4E51]", titleSize: "text-[16px]", titleFont: "font-[Montserrat]", ctaSize: "text-[13px]", ctaFont: "font-[Lato]", borderRadius: "rounded-b-[12px]" },
    mobile: { height: "81px", gradient: "from-[#276B32] to-[#1E4E51]", titleSize: "text-[13px]", titleFont: "font-[Montserrat]", ctaSize: "text-[12px]", ctaFont: "font-[Lato]", borderRadius: "" },
    background: "bg-[#FAFAFA]",
    padding: "px-0 sm:px-[7.5%]"
  },
  images: { desktopBackground: "/assets/images/banners/build.svg", mobileBackground: "/assets/images/banners/building1.svg" },
  navigationPath: "/new-launches",
  analyticsEvent: { eventName: "click_investment_report", eventParams: { Name: "front_investment_report" } },
  modalStateSelector: (state) => state.modal.showSignInModal,
  flag:'launches'
});

/* ---------- Context + Hooks ---------- */

const SiteConfigContext = createContext();

export const useSiteConfig = () => {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error('useSiteConfig must be used within SiteConfigProvider');
  return ctx;
};

export const useModalConfig = () => {
  const { modalConfig, modalLoaded } = useSiteConfig();
  return { modalConfig, modalLoaded };
};

export const useBannerConfig = () => {
  const { bannerConfig, bannerLoaded } = useSiteConfig();
  return { bannerConfig, bannerLoaded };
};

/* ---------- Provider ---------- */

export const SiteConfigProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState(null);
  const [bannerConfig, setBannerConfig] = useState(null);

  const [modalLoaded, setModalLoaded] = useState(false);
  const [bannerLoaded, setBannerLoaded] = useState(false);

  useEffect(() => {
    // Modal listener
    const modalRef = doc(db, 'truestateAdmin', 'promotionalModal');
    const unsubscribeModal = onSnapshot(
      modalRef,
      snap => {
        if (snap.exists()) {
          setModalConfig(snap.data());
          console.log('Modal config fetched from Firebase');
        } else {
          console.warn('Modal config not found, using default');
          setModalConfig(getDefaultModalConfig());
        }
        setModalLoaded(true);
      },
      err => {
        console.error('Error fetching modal config:', err);
        setModalConfig(getDefaultModalConfig());
        setModalLoaded(true);
      }
    );

    // Banner listener
    const bannerRef = doc(db, 'truestateAdmin', 'promotionalBanner');
    const unsubscribeBanner = onSnapshot(
      bannerRef,
      snap => {
        if (snap.exists()) {
          setBannerConfig(snap.data());
          console.log('Banner config fetched from Firebase');
        } else {
          console.warn('Banner config not found, using default');
          setBannerConfig(getDefaultBannerConfig());
        }
        setBannerLoaded(true);
      },
      err => {
        console.error('Error fetching banner config:', err);
        setBannerConfig(getDefaultBannerConfig());
        setBannerLoaded(true);
      }
    );

    return () => {
      unsubscribeModal();
      unsubscribeBanner();
    };
  }, []);

  const value = { modalConfig, modalLoaded, bannerConfig, bannerLoaded };

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
};
