

function FeatureCard({ title, description, imgSrc, className = "" }) {
  return (
    <div className={`p-6 lg:p-10 w-full md:w-auto h-auto rounded-2xl bg-white border-[1px] border-gray-300 flex flex-col items-center justify-between gap-6 ${className}`}>
      <div className="flex flex-col gap-1 w-full text-center">
        {/* Title */}
        <span className="font-subheading font-semibold text-lg md:text-xl lg:text-2xl text-GreenBlack">
          {title}
        </span>
        
        {/* Description */}
        <span className="font-body text-sm md:text-base lg:text-lg text-ShadedGrey">
          {description}
        </span>
      </div>

      {/* Card Image */}
      <img src={imgSrc} alt="Card Image" className="w-full md:w-auto" />
    </div>
  );
}

export default FeatureCard;
