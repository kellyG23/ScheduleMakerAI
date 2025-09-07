
import React, { useState, useCallback } from 'react';
import { ScheduleForm } from './components/ScheduleForm';
import { ScheduleTable } from './components/ScheduleTable';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Welcome } from './components/Welcome';
import { VerificationResults } from './components/VerificationResults';
import { generateSchedule, verifySchedule } from './services/geminiService';
import type { FormState, DaySchedule, VerificationResult } from './types';

const App: React.FC = () => {
  const [schedule, setSchedule] = useState<DaySchedule[] | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationResults, setVerificationResults] = useState<VerificationResult[] | null>(null);


  const handleGenerateSchedule = useCallback(async (formState: FormState) => {
    setIsLoading(true);
    setError(null);
    setSchedule(null);
    setVerificationResults(null);
    
    // Parse subjects from the new grade-specific format, removing the load part for UI
    const allSubjects = formState.subjectsByGrade
      .split('\n')
      .map(line => line.split(':')[1]) // Get text after the colon
      .filter(Boolean)
      .flatMap(subjectStr => subjectStr.split(','))
      .map(s => s.trim().replace(/\s*\(\s*\d+\s*\)/, '').trim()) // Remove (load) and trim
      .filter(Boolean);
    
    const uniqueSubjects = [...new Set(allSubjects)];
    setSubjects(uniqueSubjects);

    try {
      const generatedSchedule = await generateSchedule(formState);
      if (generatedSchedule && generatedSchedule.length > 0) {
        setSchedule(generatedSchedule);
        if (formState.conditions.length > 0 && formState.conditions.some(c => c.trim() !== '')) {
           const verification = await verifySchedule(generatedSchedule, formState.conditions);
           setVerificationResults(verification);
        }
      } else {
        setError("The AI returned an empty or invalid schedule. Please try refining your inputs.");
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate schedule. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <ScheduleForm onSubmit={handleGenerateSchedule} isLoading={isLoading} />
          
          {isLoading && <LoadingSpinner />}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}

          {!isLoading && !error && (
            <div className="space-y-8">
              {verificationResults && <VerificationResults results={verificationResults} />}
              {schedule && <ScheduleTable schedule={schedule} subjects={subjects} />}
            </div>
          )}

          {!isLoading && !error && !schedule && (
            <Welcome />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;