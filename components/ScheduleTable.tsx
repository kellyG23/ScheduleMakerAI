import React, { useMemo } from 'react';
import type { DaySchedule, Assignment } from '../types';

interface ScheduleTableProps {
  schedule: DaySchedule[];
  subjects: string[];
}

const TAILWIND_COLOR_CLASSES: { [key: string]: string } = {
  base: 'bg-gray-200 text-gray-800',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
  pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200',
  indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200'
};

const COLOR_KEYS = Object.keys(TAILWIND_COLOR_CLASSES).filter(k => k !== 'base');

const getSubjectColorMap = (subjects: string[]): Map<string, string> => {
    const map = new Map<string, string>();
    subjects.forEach((subject, index) => {
        map.set(subject, TAILWIND_COLOR_CLASSES[COLOR_KEYS[index % COLOR_KEYS.length]]);
    });
    return map;
};

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedule, subjects }) => {

    const subjectColorMap = useMemo(() => getSubjectColorMap(subjects), [subjects]);

    const processedData = useMemo(() => {
        if (!schedule || schedule.length === 0) {
            return { sections: [], timeSlots: [], days: [], dataMap: new Map() };
        }

        // Create a map for easy lookup: section -> time -> day -> assignment
        const dataMap = new Map<string, Map<string, Map<string, Assignment>>>();
        const timeSlots = new Set<string>();
        const sections = new Set<string>();
        const days = schedule.map(d => d.day);

        schedule.forEach(daySchedule => {
            daySchedule.slots.forEach(slot => {
                timeSlots.add(slot.time);
                slot.assignments.forEach(assignment => {
                    sections.add(assignment.section);
                    
                    if (!dataMap.has(assignment.section)) {
                        dataMap.set(assignment.section, new Map());
                    }
                    const sectionMap = dataMap.get(assignment.section)!;
                    
                    if (!sectionMap.has(slot.time)) {
                        sectionMap.set(slot.time, new Map());
                    }
                    const timeMap = sectionMap.get(slot.time)!;
                    
                    timeMap.set(daySchedule.day, assignment);
                });
            });
        });

        return {
            sections: Array.from(sections).sort(),
            timeSlots: Array.from(timeSlots).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
            days: days,
            dataMap: dataMap
        };
    }, [schedule]);

    if (!schedule || schedule.length === 0 || processedData.sections.length === 0) {
        return null;
    }

    const { sections: processedSections, timeSlots, days, dataMap } = processedData;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 space-y-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white">Your Generated Schedule</h2>
            {processedSections.map((section) => (
                <div key={section} className="overflow-x-auto">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">{section}</h3>
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-600 w-32">Time</th>
                                {days.map(day => (
                                    <th key={day} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-600">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {timeSlots.map(time => (
                                <tr key={time}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{time}</td>
                                    {days.map(day => {
                                        const assignment = dataMap.get(section)?.get(time)?.get(day);
                                        const colorClass = assignment ? (subjectColorMap.get(assignment.subject) || TAILWIND_COLOR_CLASSES.base) : '';
                                        return (
                                            <td key={day} className="px-2 py-2 whitespace-nowrap text-sm border-l border-gray-200 dark:border-gray-700">
                                                {assignment ? (
                                                    <div className={`p-2 rounded-lg h-full ${colorClass}`}>
                                                        <p className="font-bold text-sm">{assignment.subject}</p>
                                                        <p className="text-xs opacity-80">{assignment.teacher}</p>
                                                        {assignment.building !== '-' && (
                                                          <p className="text-xs opacity-70 mt-1 flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3v-4a1 1 0 00-1-1H9a1 1 0 00-1 1v4H5a1 1 0 110-2V4zm3 1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H8a1 1 0 01-1-1V5z" clipRule="evenodd" />
                                                            </svg>
                                                            {assignment.building}
                                                          </p>
                                                        )}
                                                    </div>
                                                ) : <div className="h-full"></div>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};
