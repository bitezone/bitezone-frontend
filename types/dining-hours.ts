// Type definitions for dining hall hours and schedules

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type MealType =
  | "breakfast"
  | "lunch"
  | "brunch"
  | "dinner"
  | "latenight";

export type DiningHallName = "cooper" | "lakeside" | "pathfinder";

export type TimeString = string; // Format: "HH:MM" (24-hour format)

export interface AdditionalService {
  name: string;
  daysOfWeek: DayOfWeek[];
  openTime: TimeString;
  closeTime: TimeString;
  note?: string;
}

export interface MealPeriod {
  type: MealType;
  name: string;
  daysOfWeek: DayOfWeek[];
  openTime: TimeString;
  closeTime: TimeString;
  startDate?: string; // Format: "YYYY-MM-DD" (optional, for seasonal services)
  additionalServices?: AdditionalService[];
}

export interface DiningHallSchedule {
  name: string;
  meals: MealPeriod[];
}

export interface DiningHoursData {
  diningHalls: DiningHallSchedule[];
}

// Status-related types
export type DiningHallStatus = "open" | "closed" | "open-limited";

export interface DiningHallStatusInfo {
  status: DiningHallStatus;
  currentMealPeriod?: MealPeriod;
  nextOpenTime?: {
    meal: MealPeriod;
    time: TimeString;
  };
  closingTime?: TimeString;
  additionalServices?: AdditionalService[];
}

// Helper type for mapping dining hall names
export const DINING_HALL_NAME_MAP: Record<DiningHallName, string> = {
  cooper: "Cooper Dining Center",
  lakeside: "Lakeside Dining Center",
  pathfinder: "Pathfinder Dining Center",
} as const;
