export const validDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

export type ValidDay = (typeof validDays)[number];

interface TaskStatus {
  [k: string]: boolean;
}

export interface DayTask {
  title: string;
  description: string;
  button_text: string;
  id: string;
}
export interface WeekTaskData {
  monday: DayTask[];
  tuesday: DayTask[];
  wednesday: DayTask[];
  thursday: DayTask[];
  friday: DayTask[];
}

export interface WeekPlanBase {
  title: string;
  taskData: WeekTaskData;
  taskStatus: TaskStatus;
  dataEntry?: Record<string, string | number>;
}

export interface WeekPlanDBModel extends WeekPlanBase {}

export interface WeekPlan extends WeekPlanBase {
  id: string;
}
