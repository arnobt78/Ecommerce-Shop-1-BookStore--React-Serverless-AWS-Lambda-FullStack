import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80">
      <div className="flex flex-col items-center">
        <span className="relative flex h-16 w-16">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-16 w-16 bg-blue-600"></span>
        </span>
        <span className="mt-6 text-lg font-semibold text-blue-700 dark:text-blue-300 animate-pulse">
          Processing...
        </span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
