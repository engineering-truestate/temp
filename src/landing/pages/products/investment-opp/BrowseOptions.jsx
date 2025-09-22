// import React, { useState } from 'react';
// import gridView from '../../../assets/investment-opp/browseOptions/gridView.webp';
// import mapView from '../../../assets/investment-opp/browseOptions/mapView.webp';
// import tableView from '../../../assets/investment-opp/browseOptions/tableView.webp';

// const PropertyBrowseOptions = () => {
//   // State to manage the current active view
//   const [activeView, setActiveView] = useState('GridView');

//   // Function to return the image based on the active view
//   const getActiveImage = () => {
//     switch (activeView) {
//       case 'TableView':
//         return tableView;
//       case 'MapView':
//         return mapView;
//       default:
//         return gridView;
//     }
//   };

//   // Button rendering logic inside the main component
//     const renderButton = (label, view) => {
//       return (
//         <button
//           onClick={() => setActiveView(view)}
//           className={`px-6 py-2 border border-gray-500 rounded-2xl lg:text-label-sm md:text-label-xs text-label-xxs transition duration-300 ease-in-out ${
//             activeView === view
//               ? 'bg-white text-GableGreen'
//               : 'bg-transparent text-white hover:bg-gray-200 hover:text-GreenBlack'
//           }`}
//         >
//           {label}
//         </button>
//       );
//     };
    


//   return (
//     <section className="browse-options-section text-white bg-GableGreen">
//       <div className="container flex flex-col py-16 md:py-20 lg:py-28 px-6 md:px-20 lg:px-24 bg-dark-green text-center lg:gap-16 gap-10">
        
//         {/* Title Section */}
//         <div className="title-section flex flex-col lg:gap-5 gap-4 items-center">
//           <h2 className="font-heading lg:text-display-md md:text-display-sm text-display-xs">
//             How Do You Prefer to Browse?
//           </h2>
//           <p className="text-heading-medium-xxs md:text-heading-medium-sm lg:text-heading-medium-md text-gray-100 text-center font-subheading">
//             View properties in ways that help you make faster, <br className='hidden md:block' /> smarter decisions—whether in table, grid, or map view.
//           </p>
//         </div>

//         <div className='flex flex-col lg:gap-7 gap-6'>

//           <div className='flex justify-center lg:p-2 p-1.5 border border-gray-500 rounded-[0.5rem] lg:rounded-[0.75rem] '
//                 style={{
//                   background: 'rgba(255, 255, 255, 0.05)',
                  
//                   backdropFilter: 'blur(4.5px)',
//                   WebkitBackdropFilter: 'blur(4.5px)', // For Safari
                
//                 }}
//                 >
//             {/* Screenshot of property options */}
//             <div className="property-view-screenshot flex justify-center">
//               <img
//                 src={getActiveImage()}
//                 alt={`${activeView} Screenshot`}
//                 className="w-full h-auto transition-opacity duration-500 ease-in-out opacity-100 object-contain rounded-[0.25rem] lg:rounded-[0.5rem]"
//               />
//             </div>
//           </div>

//           <div className="flex justify-center">
//             <div
//               className="browse-options-buttons flex justify-center md:gap-1.5 gap-1 lg:gap-2 lg:p-3 md:p-2 p-1.5 border border-gray-500 rounded-[1.75rem] w-fit"
//               style={{
//                 background: 'rgba(255, 255, 255, 0.05)',
                
//                 backdropFilter: 'blur(4.5px)',
//                 WebkitBackdropFilter: 'blur(4.5px)', // For Safari
              
//               }}
//             >

//               {/* Render Buttons */}
//               {renderButton('Table View', 'TableView')}
//               {renderButton('Grid View', 'GridView')}
//               {renderButton('Map View', 'MapView')}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PropertyBrowseOptions;


import React, { useState } from 'react';
import gridView from '../../../assets/investment-opp/browseOptions/gridView.webp';
import mapView from '../../../assets/investment-opp/browseOptions/mapView.webp';
import tableView from '../../../assets/investment-opp/browseOptions/tableView.webp';

const PropertyBrowseOptions = () => {
  // State to manage the current active view
  const [activeView, setActiveView] = useState('GridView');
  const [fade, setFade] = useState(true); // State to manage fade effect

  // Function to return the image based on the active view
  const getActiveImage = () => {
    switch (activeView) {
      case 'TableView':
        return tableView;
      case 'MapView':
        return mapView;
      default:
        return gridView;
    }
  };

  // Button rendering logic inside the main component
  const renderButton = (label, view) => {
    return (
      <button
        onClick={() => handleViewChange(view)}
        className={`px-6 py-2 border border-gray-500 rounded-2xl lg:text-label-sm md:text-label-xs text-label-xxs transition duration-300 ease-in-out ${
          activeView === view
            ? 'bg-white text-GableGreen'
            : 'bg-transparent text-white hover:bg-gray-200 hover:text-GreenBlack'
        }`}
      >
        {label}
      </button>
    );
  };

  // Handle the image fade-in and fade-out effect
  const handleViewChange = (view) => {
    if (view !== activeView) {
      // Start fade out
      setFade(false);
      setTimeout(() => {
        // Switch image after fade out completes
        setActiveView(view);
        // Start fade in
        setFade(true);
      }, 300); // Matches the transition duration
    }
  };

  return (
    <section className="browse-options-section text-white bg-GableGreen">
      <div className="container flex flex-col py-16 md:py-20 lg:py-28 px-4 md:px-20 lg:px-24 bg-dark-green text-center lg:gap-16 gap-10">
        
        {/* Title Section */}
        <div className="title-section flex flex-col lg:gap-5 gap-4 items-center">
          <h2 className="font-heading lg:text-display-md md:text-display-sm text-display-xs">
            Visualize Investment Opportunities Better
          </h2>
          <p className="text-heading-medium-xxs md:text-heading-medium-sm lg:text-heading-medium-md text-gray-100 text-center font-subheading">
            View property-related information in Grid, Table, or Map View
          </p>
        </div>

      <div className='flex flex-col lg:gap-7 gap-6'>
        <div className="flex justify-center">
            <div
              className="browse-options-buttons flex justify-center md:gap-1.5 gap-1 lg:gap-2 lg:p-3 md:p-2 p-1.5 border border-gray-500 rounded-[1.75rem] w-fit"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                
                backdropFilter: 'blur(4.5px)',
                WebkitBackdropFilter: 'blur(4.5px)', // For Safari
              
              }}
            >

              {/* Render Buttons */}
              {renderButton('Table View', 'TableView')}
              {renderButton('Grid View', 'GridView')}
              {renderButton('Map View', 'MapView')}
            </div>
          </div>

          <div className='flex justify-center lg:p-2 p-1.5 border border-gray-500 rounded-[0.5rem] lg:rounded-[0.75rem] '
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  
                  backdropFilter: 'blur(4.5px)',
                  WebkitBackdropFilter: 'blur(4.5px)', // For Safari
                
                }}
                >
            {/* Screenshot of property options */}
            <div className="property-view-screenshot flex justify-center">
              <img
                src={getActiveImage()}
                alt={`${activeView} Screenshot`}
                className={`w-full h-auto transition-opacity duration-500 ease-in-out object-contain rounded-[0.25rem] lg:rounded-[0.5rem] ${
                  fade ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default PropertyBrowseOptions;
