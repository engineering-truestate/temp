// contexts/SiteConfigContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

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
      ctaIcon: "→",
    },
    mobile: {
      title:
        "Compare new launches near Bengaluru airport by Tata, Sattva and others",
      description: "Get the complete report now",
      ctaText: "View Report",
      ctaIcon: "→",
    },
  },
  styling: {
    desktop: {
      maxWidth: "639px",
      height: "344px",
      gradient: "from-[#276B32] to-[#1E4E51]",
      titleSize: "text-[36px]",
      descriptionSize: "text-[18px]",
      ctaSize: "text-[13px]",
    },
    mobile: {
      maxWidth: "87%",
      height: "420px",
      gradient: "from-[#276B32] to-[#1E4E51]",
      titleSize: "text-[22px]",
      descriptionSize: "text-[14px]",
      ctaSize: "text-[13px]",
    },
  },
  images: {
    newBadge: "/assets/icons/ui/new-badge.svg",
    closeIcon: "/assets/icons/navigation/btn-close-modal.svg",
    desktopBackground: "/assets/images/banners/landing-image-4.svg",
    mobileBackground: "/assets/images/banners/landing-image-5.svg",
  },
  navigationPath: "/new-launches",
  analyticsEvent: {
    eventName: "click_investment_report",
    eventParams: { Name: "front_investment_report" },
  },
  flag: "launches",
});

const getDefaultBannerConfig = () => ({
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
    eventParams: { Name: "front_investment_report" },
  },
  modalStateSelector: (state) => state.modal.showSignInModal,
  flag: "launches",
});

/* ---------- Context + Hooks ---------- */
const SiteConfigContext = createContext();

export const useSiteConfig = () => {
  const ctx = useContext(SiteConfigContext);
  if (!ctx)
    throw new Error("useSiteConfig must be used within SiteConfigProvider");
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

const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours
const STORAGE_KEY_MODAL = "modalConfig";
const STORAGE_KEY_BANNER = "bannerConfig";

const getCachedConfig = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) return null; // expired
    return data;
  } catch {
    return null;
  }
};

const setCachedConfig = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  } catch (err) {
    console.err(err);
  }
};

export const SiteConfigProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState(null);
  const [bannerConfig, setBannerConfig] = useState(null);

  const [modalLoaded, setModalLoaded] = useState(false);
  const [bannerLoaded, setBannerLoaded] = useState(false);

  useEffect(() => {
    const fetchModalConfig = async () => {
      // Try cache first
      const cached = getCachedConfig(STORAGE_KEY_MODAL);
      if (cached) {
        setModalConfig(cached);
        setModalLoaded(true);
        console.log("Modal config loaded from cache");
        return;
      }

      // Fetch from Firebase
      try {
        const snap = await getDoc(
          doc(db, "truestateAdmin", "promotionalModal")
        );
        let data;
        if (snap.exists()) {
          data = snap.data();
          console.log("Modal config fetched from Firebase");
        } else {
          console.warn("Modal config not found, using default");
          data = getDefaultModalConfig();
        }
        setModalConfig(data);
        setCachedConfig(STORAGE_KEY_MODAL, data);
      } catch (err) {
        console.error("Error fetching modal config:", err);
        setModalConfig(getDefaultModalConfig());
      } finally {
        setModalLoaded(true);
      }
    };

    const fetchBannerConfig = async () => {
      // Try cache first
      const cached = getCachedConfig(STORAGE_KEY_BANNER);
      if (cached) {
        setBannerConfig(cached);
        setBannerLoaded(true);
        console.log("Banner config loaded from cache");
        return;
      }

      // Fetch from Firebase
      try {
        const snap = await getDoc(
          doc(db, "truestateAdmin", "promotionalBanner")
        );
        let data;
        if (snap.exists()) {
          data = snap.data();
          console.log("Banner config fetched from Firebase");
        } else {
          console.warn("Banner config not found, using default");
          data = getDefaultBannerConfig();
        }
        setBannerConfig(data);
        setCachedConfig(STORAGE_KEY_BANNER, data);
      } catch (err) {
        console.error("Error fetching banner config:", err);
        setBannerConfig(getDefaultBannerConfig());
      } finally {
        setBannerLoaded(true);
      }
    };

    fetchModalConfig();
    fetchBannerConfig();
  }, []);

  return (
    <SiteConfigContext.Provider
      value={{ modalConfig, modalLoaded, bannerConfig, bannerLoaded }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};
