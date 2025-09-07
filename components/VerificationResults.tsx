
import React from 'react';
import type { VerificationResult } from '../types';

interface VerificationResultsProps {
  results: VerificationResult[];
}

export const VerificationResults: React.FC<VerificationResultsProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Conditions Check</h3>
      <ul className="space-y-3">
        {results.map((result, index) => (
          <li key={index} className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
            <div className="flex-shrink-0 mr-3 mt-1">
              {result.satisfied ? (
                 <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-label="Condition Satisfied"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              ) : (
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-label="Condition Violated"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">{result.condition}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{result.reason}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
