// 1️⃣ Import Firebase Admin SDK
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// 2️⃣ Initialize Firebase Admin
initializeApp({
  credential: applicationDefault() // or use cert() with service account key
});

const db = getFirestore();

// 3️⃣ Test JSON data
const modalConfig = {
  isEnabled: true,
  delay: 5000,
  sessionStorageKey: "home_modal_shown",
  content: {
    desktop: {
      title: "🚀 New Launches Near Airport",
      subtitle: "Compare top builders like Prestige, Sobha, and more",
      description: "Get the complete investment report instantly",
      ctaText: "View Details",
      ctaIcon: "👉"
    },
    mobile: {
      title: "🚀 New Launches by Prestige, Sobha, and more",
      description: "Tap to view the complete investment report",
      ctaText: "View Details",
      ctaIcon: "👉"
    }
  },
  styling: {
    desktop: {
      maxWidth: "600px",
      height: "360px",
      gradient: "from-[#123456] to-[#654321]",
      titleSize: "text-[34px]",
      descriptionSize: "text-[16px]",
      ctaSize: "text-[14px]"
    },
    mobile: {
      maxWidth: "90%",
      height: "400px",
      gradient: "from-[#123456] to-[#654321]",
      titleSize: "text-[20px]",
      descriptionSize: "text-[13px]",
      ctaSize: "text-[12px]"
    }
  },
  images: {
    newBadge: "/assets/icons/ui/new-badge.svg",
    closeIcon: "/assets/icons/navigation/btn-close-modal.svg",
    desktopBackground: "/assets/images/banners/test-banner-desktop.svg",
    mobileBackground: "/assets/images/banners/test-banner-mobile.svg"
  },
  navigationPath: "/offers",
  analyticsEvent: {
    eventName: "click_test_modal",
    eventParams: {
      Name: "testing_modal_banner"
    }
  }
};

// 4️⃣ Upload to Firestore
async function updateConfig() {
  try {
    const docRef = db.collection("truestateAdmin").doc("promotionalModal");
    await docRef.set(modalConfig, { merge: true }); // merge so defaults fill gaps
    console.log("✅ Modal config updated successfully!");
  } catch (err) {
    console.error("❌ Error updating modal config:", err);
  }
}

updateConfig();
