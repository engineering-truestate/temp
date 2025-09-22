import AuctionDetails from "../components/ProjectDetails/AuctionDetails";

const AuctionDetailsPage = () => {
  const data = {
    projectOverview: [
      { label: "Location", value: "Hsr Layout" },
      { label: "Configuration", value: "1,2,3 BHK" },
      { label: "Stage", value: "Auction" },
      { label: "Units", value: "500" },
      { label: "Type", value: "Apartment" },
    ],
    investmentOverview: [
      { label: "Base Price", value: "₹65.25 Lac" },
      { label: "Target Price", value: "₹3.25 Crs" },
      { label: "Area", value: "2000 Sq ft" },
    ],
  };

  return <AuctionDetails data={data} />;
};

export default AuctionDetailsPage;