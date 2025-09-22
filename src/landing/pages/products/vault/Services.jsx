import React from "react";

const services = [
  {
    title: "Khata Transfer",
    image: "/vault/Services/kt.jpg",
  },
  {
    title: "Electricity Bill Transfer",
    image: "/vault/Services/ebt.jpg",
  },
  {
    title: "Sell Property",
    image: "/vault/Services/sp.jpg",
  },
  {
    title: "Title Clearance",
    image: "/vault/Services/kt.jpg",
  },
  {
    title: "Find Tenants",
    image: "/vault/Services/kt.jpg",
  },
];

const Services = () => {
  return (
    <div className="container px-4 md:px-20 lg:px-24 gap-10 md:gap-12 lg:gap-16 py-10 lg:py-14 flex flex-col items-center justify-between">
       <h2 className="font-heading text-center text-display-xs md:text-display-sm lg:text-display-md">
      Our Services
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {services.map((svc) => (
          <div
            key={svc.title}
            className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.03] transition duration-300"
          >
            {console.log(svc.image)}
            <img
              src={svc.image}
              alt={svc.title}
              className="w-full h-56 object-cover"
            />
            {/* gradient darken */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition" />
            <h3 className="absolute bottom-4 left-4 text-white text-lg font-semibold">
              {svc.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
