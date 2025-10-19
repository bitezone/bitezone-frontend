import {
  DiningHallName,
  DiningHallStatusInfo,
  MealPeriod,
  DayOfWeek,
  TimeString,
  DINING_HALL_NAME_MAP,
} from "@/types/dining-hours";
import openHoursData from "@/data/open_hours.json";
import { DiningHoursData } from "@/types/dining-hours";

// Type assertion to ensure JSON data matches our types
const typedOpenHoursData = openHoursData as DiningHoursData;

// Convert day name to day index (0 = Sunday, 1 = Monday, etc.)
const getDayIndex = (dayName: DayOfWeek): number => {
  const dayMap: Record<DayOfWeek, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  return dayMap[dayName];
};

// Convert time string "HH:MM" to minutes since midnight
const timeToMinutes = (timeString: TimeString): number => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

// Convert minutes since midnight to time string "HH:MM"
const minutesToTime = (minutes: number): TimeString => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

// Format time for display (e.g., "7:30 AM", "11:00 PM")
export const formatTimeDisplay = (timeString: TimeString): string => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const displayMinutes =
    minutes === 0 ? "" : `:${minutes.toString().padStart(2, "0")}`;
  return `${displayHours}${displayMinutes} ${period}`;
};

// Check if current day/time is within a meal period's schedule
const isWithinSchedule = (
  currentDay: number,
  currentMinutes: number,
  meal: MealPeriod
): boolean => {
  // Check if current day matches meal's days
  const mealDays = meal.daysOfWeek.map(getDayIndex);
  if (!mealDays.includes(currentDay)) {
    return false;
  }

  // Check if current time is within meal hours
  const openMinutes = timeToMinutes(meal.openTime);
  const closeMinutes = timeToMinutes(meal.closeTime);

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
};

// Get the dining hall schedule by name
const getDiningHallSchedule = (hallName: DiningHallName) => {
  const fullName = DINING_HALL_NAME_MAP[hallName];
  return typedOpenHoursData.diningHalls.find((hall) => hall.name === fullName);
};

// Check if any additional services are currently open
const isAnyAdditionalServiceOpen = (
  currentDay: number,
  currentMinutes: number,
  meal: MealPeriod
): boolean => {
  if (!meal.additionalServices) return false;

  for (const service of meal.additionalServices) {
    const serviceDays = service.daysOfWeek.map(getDayIndex);
    if (serviceDays.includes(currentDay)) {
      const openMinutes = timeToMinutes(service.openTime);
      const closeMinutes = timeToMinutes(service.closeTime);
      if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
        return true;
      }
    }
  }
  return false;
};

// Get current meal period if dining hall is open
const getCurrentMealPeriod = (
  currentDay: number,
  currentMinutes: number,
  hallName: DiningHallName
): MealPeriod | null => {
  const schedule = getDiningHallSchedule(hallName);
  if (!schedule) return null;

  // Find the meal period that's currently active (main meal OR additional services)
  for (const meal of schedule.meals) {
    // Check if main meal is active
    if (isWithinSchedule(currentDay, currentMinutes, meal)) {
      return meal;
    }

    // Check if any additional services are active (but return the main meal period)
    if (isAnyAdditionalServiceOpen(currentDay, currentMinutes, meal)) {
      return meal;
    }
  }
  return null;
};

// Check if only additional services are open (not main meal)
const isOnlyAdditionalServicesOpen = (
  currentDay: number,
  currentMinutes: number,
  hallName: DiningHallName
): boolean => {
  const schedule = getDiningHallSchedule(hallName);
  if (!schedule) return false;

  // Check if main meal is active - if so, not "limited"
  for (const meal of schedule.meals) {
    if (isWithinSchedule(currentDay, currentMinutes, meal)) {
      return false;
    }
  }

  // Check if any additional services are active
  for (const meal of schedule.meals) {
    if (isAnyAdditionalServiceOpen(currentDay, currentMinutes, meal)) {
      return true;
    }
  }
  return false;
};

// Get next meal period that will open
const getNextMealPeriod = (
  currentDay: number,
  currentMinutes: number,
  hallName: DiningHallName
): MealPeriod | null => {
  const schedule = getDiningHallSchedule(hallName);
  if (!schedule) return null;

  // Get all meal periods for today
  const todayMeals = schedule.meals.filter((meal) =>
    meal.daysOfWeek.map(getDayIndex).includes(currentDay)
  );

  // Sort by opening time
  todayMeals.sort(
    (a, b) => timeToMinutes(a.openTime) - timeToMinutes(b.openTime)
  );

  // Find next meal that hasn't started yet
  for (const meal of todayMeals) {
    if (timeToMinutes(meal.openTime) > currentMinutes) {
      return meal;
    }
  }

  // If no more meals today, return first meal of next day
  const tomorrow = (currentDay + 1) % 7;
  const tomorrowMeals = schedule.meals.filter((meal) =>
    meal.daysOfWeek.map(getDayIndex).includes(tomorrow)
  );

  if (tomorrowMeals.length > 0) {
    tomorrowMeals.sort(
      (a, b) => timeToMinutes(a.openTime) - timeToMinutes(b.openTime)
    );
    return tomorrowMeals[0];
  }

  return null;
};

// Main function to get dining hall status
export const getDiningHallStatus = (
  hallName: DiningHallName,
  currentDate: Date = new Date()
): DiningHallStatusInfo => {
  const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentMinutes = timeToMinutes(
    minutesToTime(currentDate.getHours() * 60 + currentDate.getMinutes())
  );

  // Check if currently open
  const currentMeal = getCurrentMealPeriod(
    currentDay,
    currentMinutes,
    hallName
  );

  if (currentMeal) {
    // Determine closing time - use the latest closing time (main meal or additional services)
    let closingTime = currentMeal.closeTime;
    if (currentMeal.additionalServices) {
      for (const service of currentMeal.additionalServices) {
        const serviceDays = service.daysOfWeek.map(getDayIndex);
        if (serviceDays.includes(currentDay)) {
          if (timeToMinutes(service.closeTime) > timeToMinutes(closingTime)) {
            closingTime = service.closeTime;
          }
        }
      }
    }

    // Check if only additional services are open (not main meal)
    const isLimited = isOnlyAdditionalServicesOpen(
      currentDay,
      currentMinutes,
      hallName
    );

    // Dining hall is open - hide confusing additional services from display
    return {
      status: isLimited ? "open-limited" : "open",
      currentMealPeriod: currentMeal,
      closingTime: closingTime,
      additionalServices: undefined, // Hide from user interface
    };
  }

  // Dining hall is closed - find next opening
  const nextMeal = getNextMealPeriod(currentDay, currentMinutes, hallName);

  return {
    status: "closed",
    nextOpenTime: nextMeal
      ? {
          meal: nextMeal,
          time: nextMeal.openTime,
        }
      : undefined,
  };
};

// Helper to get all dining halls' status for overview
export const getAllDiningHallsStatus = (currentDate: Date = new Date()) => {
  const halls: DiningHallName[] = ["cooper", "lakeside", "pathfinder"];
  return halls.map((hallName) => ({
    hallName,
    hallDisplayName: DINING_HALL_NAME_MAP[hallName],
    status: getDiningHallStatus(hallName, currentDate),
  }));
};
