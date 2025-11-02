import React from "react";

export const TestListSkeleton = () => {
  return (
    <div className="p-3 grid grid-cols-1 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="relative overflow-hidden bg-white/90 dark:bg-gray-800 rounded-2xl shadow-md p-4 border border-gray-200/50 dark:border-gray-700/50"
        >
          {/* Gradient shine animation */}
          <div className="absolute inset-0 -translate-x-full animate-[shine_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/30 to-transparent"></div>

          <div className="flex justify-between items-center mb-3">
            <div className="h-4 w-1/3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded"></div>
            <div className="h-4 w-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full"></div>
          </div>

          <div className="h-5 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded mb-3"></div>
          <div className="h-4 w-1/2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded mb-4"></div>

          <div className="flex justify-between items-center">
            <div className="h-9 w-28 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full"></div>
            <div className="h-9 w-9 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
