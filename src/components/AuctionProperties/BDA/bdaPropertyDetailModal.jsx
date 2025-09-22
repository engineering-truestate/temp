import InvManager from "../../../utils/InvManager";

// Mock utility functions to match the original code
const formatTimestampDate = (timestamp) => {
  if (!timestamp) return "____";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCost = (cost) => {
  return cost ? `₹${cost.toLocaleString()}` : "____";
};

const toCapitalizedWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const BdaPropertyDetailModal = ({
  isOpen = true,
  onClose = () => {},
  property = sampleProperty,
}) => {
  if (!isOpen || !property) return null;

  const formatPriceInCrores = (price) => {
    if (price) {
      return `₹${(price / 100).toFixed(1)} Crs`;
    }
    return "____";
  };

  const formatPriceInLacs = (price) => {
    if (price) {
      return `₹${price.toFixed(2)} Lac`;
    }
    return "____";
  };

  const handleOpenWhatsapp = () => {
    const phoneNumber = InvManager.phoneNumber;
    const message = `Hi - I’m interested in the auction of BDA Plot ${property.siteNo} ${property.layoutName}`;
    navigator.clipboard.writeText(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}/?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div>
        {property?.recommended && (
          <div className="relative top-3 w-fit left-6 font-lato bg-[#F6D343] text-gray-800 py-1 pl-1 px-2 rounded-[4px] font-semibold text-sm  flex items-center gap-1.5 z-10">
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="0.5" width="20" height="20" rx="5" fill="white" />
              <path
                d="M15.2882 7.0608V9.44963L9.9926 6.63882H9.99173L4.71094 9.44244V7.05281L9.99173 4.25L15.2882 7.0608Z"
                fill="#151413"
              />
              <path
                d="M15.2882 11.4274V14.6817H13.0373V12.6214L13.0225 12.6134L11.1246 11.6064V16.7501H8.87454V11.5984L6.96097 12.6134V14.6817H4.71094V11.4194L6.96097 10.2246L9.99086 8.61658L9.99955 8.62057L13.0373 10.2326L15.2882 11.4274Z"
                fill="#151413"
              />
              <path
                opacity="0.4"
                d="M15.2885 7.06375V9.45849L10.0002 6.64473V4.25L15.2885 7.06375Z"
                fill="#151413"
              />
              <path
                opacity="0.4"
                d="M15.2889 11.4272V14.6815H13.038V12.6212L13.0232 12.6132L11.1253 11.6062V16.7499H10.0002V8.62036L13.038 10.2324L15.2889 11.4272Z"
                fill="#151413"
              />
            </svg>
            Recommended
          </div>
        )}

        <div className="flex flex-col gap-5 bg-white rounded-lg max-w-md w-full shadow-xl py-5 px-6 font-montserrat">
          {/* Header */}
          <div className="relative">
            {/* Title */}
            <h2 className="text-lg font-bold text-gray-900 pr-8 leading-tight">
              {property.siteNo}: {toCapitalizedWords(property.layoutName || "")}
            </h2>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-0 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                width="9"
                height="10"
                viewBox="0 0 9 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1.5L8 8.5M1 8.5L8 1.5"
                  stroke="#2B2928"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className=" flex flex-col">
            {/* Basic Info */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-row">
                <span className="text-sm text-gray-900 font-medium max-w-[40%] w-full">
                  Micro Market :
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {property.micromarket || "____"}
                </span>
              </div>

              <div className="flex flex-row">
                <span className="text-sm text-gray-900 font-medium max-w-[40%] w-full">
                  Plot Area :
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {property.plotArea ? `${property.plotArea} Sq ft` : "____"}
                </span>
              </div>

              <div className="flex flex-row">
                <span className="text-sm text-gray-900 font-medium max-w-[40%] w-full">
                  Reserve Price :
                </span>
                <span className="text-sm text-gray-900 font-semibold">
                  {formatPriceInCrores(property.reservePrice)}
                </span>
              </div>

              <div className="flex flex-row">
                <span className="text-sm text-gray-900 font-medium max-w-[40%] w-full">
                  EMD Price :
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPriceInLacs(property.emdPrice)}
                </span>
              </div>

              <div className="flex flex-row">
                <span className="text-sm text-gray-900 font-medium max-w-[40%] w-full">
                  Price / Sq ft :
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {property.pricePerSqft
                    ? `₹${property.pricePerSqft.toLocaleString()}`
                    : "____"}
                </span>
              </div>

              <div className="flex flex-row">
                <span className="text-sm text-gray-900 font-medium max-w-[40%] w-full">
                  EMD Date :
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {property.emdDate
                    ? formatTimestampDate(property.emdDate)
                    : "____"}
                </span>
              </div>

              <div className="flex flex-row">
                <span className="text-sm text-gray-900 font-medium max-w-[40%] w-full">
                  Auction Date :
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {property.auctionDate
                    ? formatTimestampDate(property.auctionDate)
                    : "____"}
                </span>
              </div>

              <div className="flex flex-row">
                <span className="text-sm text-gray-900 font-medium max-w-[40%] w-full">
                  North to South :
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {property.northToSouth || "____"}
                </span>
              </div>

              <div className="flex flex-row">
                <span className="text-sm text-gray-900 font-medium max-w-[40%] w-full">
                  East to West :
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {property.eastToWest || "____"}
                </span>
              </div>

              <div className="flex flex-row">
                <div className="text-sm text-gray-900 font-medium max-w-[40%] w-full">
                  Address :
                </div>
                <div className="text-sm font-semibold text-gray-900 leading-relaxed">
                  {property.address || "____"}
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Invest Now Button */}
          <div>
            <button
              onClick={handleOpenWhatsapp}
              className="w-full bg-[#153E3B] text-white py-2 px-3 rounded-lg text-sm font-semibold font-lato transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              Enquire Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BdaPropertyDetailModal;
