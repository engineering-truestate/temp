import { Routes, Route } from "react-router-dom";

// Landing page components (existing)
import Home from "./landing/pages/home/Home";
import AboutUs from "./landing/pages/about/AboutUs";
import Academy from "./landing/pages/academy/Academy";
import BlogContent from "./landing/pages/academy/blogContent/BlogContent";
import Career from "./landing/pages/career/Career";
import ContactUs from "./landing/pages/contactUs/ContactUs";
import InvestmentOpportunities from "./landing/pages/products/investment-opp/InvestmentOpportunities";
import MarketIntelligence from "./landing/pages/products/MarketIntelligence";
import TruEstimate from "./landing/pages/products/TruEstimate";
import TruGrowth from "./landing/pages/products/TruGrowth";
import Vault from "./landing/pages/products/vault/Vault";

// Main app components (existing)
import AuctionGuide from "./components/AuctionProperties/AuctionGuide.jsx";
import NewLaunches from "./pages/NewLaunches.jsx";
import PrivacyPolicy from "./components/Website/PrivacyPolicy";
import TnC from "./components/Website/TnC";
import SignIn from "./pages/SignIn";

// Dashboard page components (to be created)
import PropertiesPage from "./pages/PropertiesPage";
import WishlistPage from "./pages/WishlistPage";
import BlogPage from "./pages/BlogPage";
import BlogContentPage from "./pages/BlogContentPage";
import RequirementPage from "./pages/RequirementPage";
import ProfilePage from "./pages/ProfilePage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import AuctionDetailsPage from "./pages/AuctionDetailsPage";
import ComparePage from "./pages/ComparePage";
import HelpPage from "./pages/HelpPage";
import CompareAddPage from "./pages/CompareAddPage";
import ReportPage from "./pages/ReportPage";
import VaultPage from "./pages/VaultPage";
import VaultFindProjectPage from "./pages/VaultFindProjectPage";
import VaultFormPage from "./pages/VaultFormPage";
import VaultSummaryPage from "./pages/VaultSummaryPage";
import VaultInvestmentPage from "./pages/VaultInvestmentPage";
import VaultInvestmentDetailsPage from "./pages/VaultInvestmentDetailsPage";
import AuctionPage from "./pages/AuctionPage";
import BdaAuctionPage from "./pages/BdaAuctionPage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import NotFoundPage from "./NotFoundPage";

// Route protection components
import UnprotectedRoute from "./components/UnprotectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main App Routes */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/tnc" element={<TnC />} />
      <Route path="/signin" element={<SignIn />} />

      {/* Landing page routes */}
      <Route path="/" element={<UnprotectedRoute><Home /></UnprotectedRoute>} />
      <Route path="/about" element={<UnprotectedRoute><AboutUs /></UnprotectedRoute>} />
      <Route path="/insights/:slug" element={<UnprotectedRoute><BlogContent /></UnprotectedRoute>} />
      <Route path="/insights" element={<UnprotectedRoute><Academy /></UnprotectedRoute>} />
      <Route path="/career" element={<UnprotectedRoute><Career /></UnprotectedRoute>} />
      <Route path="/career:id" element={<UnprotectedRoute><Career /></UnprotectedRoute>} />
      <Route path="/contact" element={<UnprotectedRoute><ContactUs /></UnprotectedRoute>} />
      <Route
        path="/products/investment-opportunities"
        element={<UnprotectedRoute><InvestmentOpportunities /></UnprotectedRoute>}
      />
      <Route path="/market-intelligence" element={<UnprotectedRoute><MarketIntelligence /></UnprotectedRoute>} />
      <Route path="/tru-estimate" element={<UnprotectedRoute><TruEstimate /></UnprotectedRoute>} />
      <Route path="/tru-growth" element={<UnprotectedRoute><TruGrowth /></UnprotectedRoute>} />
      <Route path="/products/vault" element={<UnprotectedRoute><Vault /></UnprotectedRoute>} />
      <Route path="/auction-guide" element={<UnprotectedRoute><AuctionGuide /></UnprotectedRoute>} />
      <Route path="/new-launches" element={<UnprotectedRoute><NewLaunches /></UnprotectedRoute>} />

      {/* Dashboard routes */}
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/properties/:projectName/:id" element={<ProjectDetailsPage />} />
      <Route path="/properties/:projectName/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />

      <Route path="/auction" element={<ProtectedRoute><AuctionPage /></ProtectedRoute>} />
      <Route path="/auction/bda-auction" element={<ProtectedRoute><BdaAuctionPage /></ProtectedRoute>} />
      <Route path="/auction/:projectName/:id" element={<AuctionDetailsPage />} />

      <Route path="/opportunities" element={<ProtectedRoute><OpportunitiesPage /></ProtectedRoute>} />

      <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

      <Route path="/blog" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
      <Route path="/blog/:blogId" element={<ProtectedRoute><BlogContentPage /></ProtectedRoute>} />

      <Route path="/requirement" element={<ProtectedRoute><RequirementPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      <Route path="/compare" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
      <Route path="/compare/addcompare" element={<ProtectedRoute><CompareAddPage /></ProtectedRoute>} />

      <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />

      <Route path="/vault" element={<ProtectedRoute><VaultPage /></ProtectedRoute>} />
      <Route path="/vault/findproject" element={<ProtectedRoute><VaultFindProjectPage /></ProtectedRoute>} />
      <Route path="/vault/vaultform" element={<ProtectedRoute><VaultFormPage /></ProtectedRoute>} />
      <Route path="/vault/vaultsummary" element={<ProtectedRoute><VaultSummaryPage /></ProtectedRoute>} />
      <Route path="/vault/investment" element={<ProtectedRoute><VaultInvestmentPage /></ProtectedRoute>} />
      <Route path="/vault/investment/:holdingName" element={<ProtectedRoute><VaultInvestmentDetailsPage /></ProtectedRoute>} />

      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;