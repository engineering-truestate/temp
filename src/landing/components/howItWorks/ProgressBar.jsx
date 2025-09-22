


import React from 'react';

const ProgressBar = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-evenly gap-6 h-[32.188rem]">
      <span className="text-ShadedGrey text-paragraph-xs font-body bg-gray-300 py-2 px-3 rounded-lg">Think</span>

      <div className="relative w-1 h-[80%] bg-gray-200">
        {/* Green progress bar */}
        <div
          className="absolute w-full bg-GableGreen transition-all duration-500 ease-in-out"
          style={{ height: `${(step / 3) * 100}%` }}
        />

        {/* Checkpoints */}
        <div className="relative h-full">
          {/* Circle 1 */}
          <div
            className={`absolute w-4 h-4 rounded-full transform -translate-x-[0.375rem] ${
              step >= 0 ? 'bg-GableGreen !border-GableGreen' : 'bg-gray-200 !border-gray-300'
            }`}
            style={{ top: '0%', border: '2px solid' }}
          />

          {/* Circle 2 */}
          <div
            className={`absolute w-4 h-4 rounded-full transform -translate-x-[0.375rem] ${
              step >= 1 ? 'bg-GableGreen !border-GableGreen' : 'bg-gray-200 !border-gray-300'
            }`}
            style={{ top: '32.33%', border: '2px solid' }}
          />

          {/* Circle 3 */}
          <div
            className={`absolute w-4 h-4 rounded-full transform -translate-x-[0.375rem] ${
              step >= 2 ? 'bg-GableGreen !border-GableGreen' : 'bg-gray-200 !border-gray-300'
            }`}
            style={{ top: '64.66%', border: '2px solid' }}
          />

          {/* Circle 4 */}
          <div
            className={`absolute w-4 h-4 rounded-full transform -translate-x-[0.375rem] ${
              step >= 3 ? 'bg-GableGreen !border-GableGreen' : 'bg-gray-200 !border-gray-300'
            }`}
            style={{ top: '97%', border: '2px solid' }}
          />
        </div>
      </div>

      <span className="text-ShadedGrey text-sm font-body bg-gray-300 px-2 py-3 rounded-lg">Commit</span>
    </div>
  );
};

export default ProgressBar;


