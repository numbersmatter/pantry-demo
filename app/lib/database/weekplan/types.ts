export interface DayTask {
  title: string;
  description: string;
  button_text: string;
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
}

export interface WeekPlanDBModel extends WeekPlanBase {}

export interface WeekPlan extends WeekPlanBase {
  id: string;
}
