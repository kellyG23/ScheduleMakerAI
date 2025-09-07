
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
        AI is crafting your schedule...
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">This may take a moment.</p>
    </div>
  );
};
