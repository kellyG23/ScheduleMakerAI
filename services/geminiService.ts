
import { GoogleGenAI, Type } from '@google/genai';
import type { FormState, DaySchedule, VerificationResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const scheduleSchema = {
  type: Type.ARRAY,
  description: "The weekly school schedule, containing an object for each selected day.",
  items: {
    type: Type.OBJECT,
    properties: {
      day: {
        type: Type.STRING,
        description: "The day of the week (e.g., 'Monday')."
      },
      slots: {
        type: Type.ARRAY,
        description: "An array of time slots for the day.",
        items: {
          type: Type.OBJECT,
          properties: {
            time: {
              type: Type.STRING,
              description: "The one-hour time slot (e.g., '09:00-10:00')."
            },
            assignments: {
              type: Type.ARRAY,
              description: "An array of assignments for each section in this time slot.",
              items: {
                type: Type.OBJECT,
                properties: {
                  section: {
                    type: Type.STRING,
                    description: "The section identifier (e.g., 'Section A')."
                  },
                  teacher: {
                    type: Type.STRING,
                    description: "The name of the assigned teacher from the provided roster (e.g., 'Mr. Smith'). For breaks, this should be '-'."
                  },
                  subject: {
                    type: Type.STRING,
                    description: "The subject assigned from the provided list, or the name of the break (e.g., 'Lunch Break')."
                  },
                  building: {
                    type: Type.STRING,
                    description: "The building where the class is held (e.g., 'Building 1'). This must follow the 'Subject-Specific Building Assignments' if applicable. For breaks, this should be '-'."
                  }
                },
                required: ["section", "teacher", "subject", "building"]
              }
            }
          },
          required: ["time", "assignments"]
        }
      }
    },
    required: ["day", "slots"]
  }
};

const verificationSchema = {
  type: Type.ARRAY,
  description: "An array of verification results for each user-provided condition.",
  items: {
    type: Type.OBJECT,
    properties: {
      condition: {
        type: Type.STRING,
        description: "The original condition text that was checked."
      },
      satisfied: {
        type: Type.BOOLEAN,
        description: "True if the schedule satisfies the condition, false otherwise."
      },
      reason: {
        type: Type.STRING,
        description: "A brief explanation for why the condition is satisfied or not. If not satisfied, point out the specific conflict."
      }
    },
    required: ["condition", "satisfied", "reason"]
  }
};


const buildPrompt = (formState: FormState): string => {
  const { teacherDefinitions, sectionDefinitions, gradeLevels, subjectsByGrade, subjectBuildingAssignments, conditions, breaks, days, startHour, endHour } = formState;
  const nonEmptyConditions = conditions.filter(c => c.trim() !== '');

  return `
You are an expert school schedule planner AI. Your task is to create a balanced and non-repetitive weekly schedule based on the following constraints for a school.

Constraints:
- Teacher Roster and Specialties:
${teacherDefinitions}
- Section Definitions (Section Name - Grade Level - Building):
${sectionDefinitions}
- Grade Levels being scheduled: ${gradeLevels}
- Subjects & Weekly Load by Grade Level:
${subjectsByGrade}
${subjectBuildingAssignments.trim() ? `- Subject-Specific Building Assignments:\n${subjectBuildingAssignments}` : ''}
- School days: ${days.join(', ')}
- School hours: From ${startHour}:00 to ${endHour}:00 in one-hour slots.
${breaks.trim() ? `- Breaks & Unscheduled Time: ${breaks}` : ''}
${nonEmptyConditions.length > 0 ? `- Additional Conditions:\n${nonEmptyConditions.map((c, i) => `${i + 1}. ${c}`).join('\n')}` : ''}

Instructions:
1. Strictly adhere to all provided constraints.
2. CRITICAL RULE: For any given section (e.g., 'Section A'), a specific subject (e.g., 'Math') MUST be taught by the same teacher throughout the entire weekly schedule. For instance, if Mr. Davison teaches Math to Section A on Monday, he must also be the teacher for Math for Section A on all other days it is scheduled. A different teacher cannot be assigned to teach Math to Section A.
3. The 'Section Definitions' list provides the complete roster of sections to be scheduled, along with their assigned grade level and permanent building. For every time slot, each section must be assigned a class or a break.
4. Each section's grade level is explicitly defined. You MUST assign subjects to a section strictly based on the "Subjects by Grade Level" definitions for that section's grade.
5. Each section has a default building defined. A section should generally remain in its assigned building.
6. CRITICAL RULE for Subject Buildings: The 'Subject-Specific Building Assignments' list provides overriding building rules. If a subject is listed there (e.g., 'Science - Building 2'), ALL classes for that subject, regardless of section or grade, MUST be scheduled in the specified building. The 'building' in the output for that class must reflect this specific assignment, even if it's different from the section's default building.
7. Assign teachers from the provided roster to each class. A teacher can only teach the subjects and grade levels they are assigned. The teacher's name in the output must exactly match the name from the roster.
8. CRITICAL RULE: In the "Subjects & Weekly Load" list, the number in parentheses next to each subject is its 'weekly load'. This is the total number of one-hour classes that subject MUST have for each section in that grade per week. For example, 'Math (5)' means each section in that grade must have exactly 5 hours of Math class in total for the week. Distribute these hours across the selected days.
9. A teacher cannot teach two different sections in the same time slot.
10. A section can only have one teacher and one subject in any given time slot.
11. During time slots designated for breaks (e.g., "Lunch Break: 12:00-13:00"), you must create an assignment for ALL sections. For these assignments, the 'subject' should be the name of the break (e.g., 'Lunch Break'). CRITICALLY, no teacher should be present during a break, so the 'teacher' field must be set to "-". Similarly, the 'building' field must also be set to "-".
12. Not all subjects need to have the same amount of class time; their frequency is dictated by their 'weekly load'. Create a balanced weekly curriculum based on this load.
13. Try to avoid scheduling the same subject for the same section in consecutive time slots, unless it is a break.
14. Ensure every section has a teacher, subject, and building assigned for every available time slot. For breaks, follow instruction #11.
15. The output must be a valid JSON array that strictly adheres to the provided schema. Do not include any other text, explanations, or markdown formatting.
  `;
};

export const generateSchedule = async (formState: FormState): Promise<DaySchedule[] | null> => {
  const prompt = buildPrompt(formState);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: scheduleSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const scheduleData = JSON.parse(jsonText);
    
    if (Array.isArray(scheduleData)) {
      return scheduleData as DaySchedule[];
    }
    
    return null;
  } catch (error) {
    console.error("Error generating schedule with Gemini:", error);
    throw new Error("Failed to parse or retrieve schedule from AI.");
  }
};

export const verifySchedule = async (schedule: DaySchedule[], conditions: string[]): Promise<VerificationResult[] | null> => {
  const nonEmptyConditions = conditions.filter(c => c.trim() !== '');
  if (nonEmptyConditions.length === 0) {
    return [];
  }

  const verificationPrompt = `
You are a schedule verification AI. I will provide you with a school schedule in JSON format and a list of conditions. Your task is to check if the schedule adheres to every single condition.
For each condition, you must respond whether it was satisfied or not, and provide a brief reason for your assessment. Your response must be a valid JSON array that adheres to the provided schema. Do not include any other text or markdown.

SCHEDULE JSON:
${JSON.stringify(schedule, null, 2)}

CONDITIONS TO CHECK:
${nonEmptyConditions.map((c, i) => `${i + 1}. ${c}`).join('\n')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: verificationPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: verificationSchema,
      },
    });

    const jsonText = response.text.trim();
    const verificationData = JSON.parse(jsonText);
    
    if(Array.isArray(verificationData)) {
      return verificationData as VerificationResult[];
    }
    
    return null;

  } catch(error) {
    console.error("Error verifying schedule with Gemini:", error);
    throw new Error("Failed to parse or retrieve verification from AI.");
  }
}