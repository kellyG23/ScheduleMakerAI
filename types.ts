export interface FormState {
  teacherDefinitions: string;
  sectionDefinitions: string;
  gradeLevels: string;
  subjectsByGrade: string;
  subjectBuildingAssignments: string;
  conditions: string[];
  breaks: string;
  days: string[];
  startHour: number;
  endHour: number;
}

export interface Assignment {
  section: string;
  teacher: string;
  subject: string;
  building: string;
}

export interface TimeSlot {
  time: string;
  assignments: Assignment[];
}

export interface DaySchedule {
  day: string;
  slots: TimeSlot[];
}

export interface VerificationResult {
  condition: string;
  satisfied: boolean;
  reason: string;
}