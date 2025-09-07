
import React from 'react';

const FeatureCard: React.FC<{ icon: JSX.Element, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center text-center p-4">
        <div className="flex-shrink-0 mb-4 text-blue-500">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

export const Welcome: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-10 text-center">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
        Welcome to the AI Schedule Maker!
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
        Simply fill out the form above to generate a balanced, color-coded weekly schedule for your team or class.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <FeatureCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
              title="Define Constraints"
              description="Specify people, tasks, days, and hours."
          />
          <FeatureCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" /></svg>}
              title="AI-Powered Generation"
              description="Gemini AI creates a balanced and logical schedule."
          />
          <FeatureCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              title="Visualize Instantly"
              description="View and analyze your new schedule in a clear table."
          />
      </div>
    </div>
  );
};
