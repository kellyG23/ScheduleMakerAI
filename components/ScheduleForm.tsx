
import React, { useState } from 'react';
import type { FormState } from '../types';

interface ScheduleFormProps {
  onSubmit: (formState: FormState) => void;
  isLoading: boolean;
}

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const ScheduleForm: React.FC<ScheduleFormProps> = ({ onSubmit, isLoading }) => {
  const [formState, setFormState] = useState<FormState>({
    teacherDefinitions: 'Mr. Davison - Math (Grade 7, Grade 8)\nMs. Smith - Science (Grade 6, Grade 7, Grade 8)\nMr. Jones - History (All Grades)\nMs. Garcia - Art (All Grades)\nCoach Miller - PE (All Grades)',
    sectionDefinitions: 'Section A - Grade 6 - Building 1\nSection B - Grade 6 - Building 1\nSection C - Grade 7 - Building 2\nSection D - Grade 8 - Building 2',
    gradeLevels: 'Grade 6, Grade 7, Grade 8',
    subjectsByGrade: 'Grade 6: Math (5), Science (4), History (3), Art (2), English (5), PE (2)\nGrade 7: Algebra (5), Biology (4), World History (3), Art (2), English (5), PE (2)\nGrade 8: Geometry (5), Chemistry (4), US History (3), Art (2), English (5), PE (2)',
    subjectBuildingAssignments: 'Science - Building 2\nPE - Gym',
    conditions: ['The PE teacher is not available on Monday mornings.', 'Science classes should not be scheduled back-to-back for the same section.'],
    breaks: 'Lunch Break: 12:00-13:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startHour: 9,
    endHour: 15,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: name === 'startHour' || name === 'endHour' ? parseInt(value, 10) : value,
    }));
  };
  
  const handleConditionChange = (index: number, value: string) => {
    const newConditions = [...formState.conditions];
    newConditions[index] = value;
    setFormState(prevState => ({ ...prevState, conditions: newConditions }));
  };

  const handleAddCondition = () => {
    setFormState(prevState => ({ ...prevState, conditions: [...prevState.conditions, ''] }));
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = formState.conditions.filter((_, i) => i !== index);
    setFormState(prevState => ({ ...prevState, conditions: newConditions }));
  };


  const handleDayChange = (day: string) => {
    setFormState(prevState => {
      const newDays = prevState.days.includes(day)
        ? prevState.days.filter(d => d !== day)
        : [...prevState.days, day];
      return { ...prevState, days: newDays };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.days.length > 0 && formState.subjectsByGrade.trim() !== '' && formState.gradeLevels.trim() !== '' && formState.teacherDefinitions.trim() !== '' && formState.sectionDefinitions.trim() !== '') {
      onSubmit(formState);
    } else {
      alert("Please define teachers, section definitions, subjects, grade levels, and select at least one day.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label htmlFor="teacherDefinitions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teacher Definitions & Specialties</label>
            <textarea
              id="teacherDefinitions"
              name="teacherDefinitions"
              value={formState.teacherDefinitions}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Mr. Smith - Math (Grade 7)&#10;Ms. Davis - Science (All Grades)"
              required
            />
             <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Define each teacher per line.</p>
          </div>
          <div>
            <label htmlFor="sectionDefinitions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Section Definitions</label>
            <textarea
              id="sectionDefinitions"
              name="sectionDefinitions"
              value={formState.sectionDefinitions}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Section A - Grade 6 - Building 1&#10;Section B - Grade 6 - Building 1&#10;Section C - Grade 7 - Building 2"
              required
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Define each section's grade and building per line.</p>
          </div>
          <div>
            <label htmlFor="gradeLevels" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Grade Levels</label>
           <input
             type="text"
             id="gradeLevels"
             name="gradeLevels"
             value={formState.gradeLevels}
             onChange={handleInputChange}
             className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
             placeholder="e.g., Grade 6, 7, 8"
             required
           />
         </div>
          <div>
            <label htmlFor="subjectsByGrade" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subjects & Weekly Load by Grade</label>
            <textarea
              id="subjectsByGrade"
              name="subjectsByGrade"
              value={formState.subjectsByGrade}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Grade 6: Math (5), Science (4)&#10;Grade 7: Algebra (5), Biology (4)"
              required
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Define subjects and their total weekly hours (load) per grade.</p>
          </div>
        </div>
        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Working Days</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {WEEK_DAYS.map(day => (
                <label key={day} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.days.includes(day)}
                    onChange={() => handleDayChange(day)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{day}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Working Hours (24h format)</label>
            <div className="mt-2 flex items-center space-x-2">
              <input
                type="number"
                name="startHour"
                value={formState.startHour}
                onChange={handleInputChange}
                min="0"
                max="23"
                className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <span className="text-gray-500 dark:text-gray-400">to</span>
              <input
                type="number"
                name="endHour"
                value={formState.endHour}
                onChange={handleInputChange}
                min="1"
                max="24"
                className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
           <div>
            <label htmlFor="subjectBuildingAssignments" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject Building Assignments (Optional)</label>
            <textarea
              id="subjectBuildingAssignments"
              name="subjectBuildingAssignments"
              value={formState.subjectBuildingAssignments}
              onChange={handleInputChange}
              rows={2}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Science - Building 2&#10;PE - Gym"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Force subjects into a specific building. One rule per line.</p>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Additional Conditions (Optional)</label>
            <div className="space-y-2 mt-1">
              {formState.conditions.map((condition, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={condition}
                    onChange={(e) => handleConditionChange(index, e.target.value)}
                    className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., No PE on Friday afternoons"
                  />
                  <button type="button" onClick={() => handleRemoveCondition(index)} className="p-2 text-gray-400 hover:text-red-500">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddCondition}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                + Add Condition
              </button>
            </div>
          </div>
           <div>
            <label htmlFor="breaks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Breaks & Unscheduled Time (Optional)</label>
            <textarea
              id="breaks"
              name="breaks"
              value={formState.breaks}
              onChange={handleInputChange}
              rows={2}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Lunch Break: 12:00-13:00&#10;Assembly: Friday 10:00-11:00"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">The AI will not schedule classes during these times.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Generate Schedule'}
        </button>
      </div>
    </form>
  );
};