// components/DiningHallMenu.tsx
"use client";
import CalorieIndicator from "@/components/MenuPage/CalorieIndicator";
import MealTimeSelector from "@/components/MenuPage/MealTimeSelector";
import MenuFilter from "@/components/MenuPage/MenuFilter";
import MenuNavigation from "@/components/MenuPage/MenuNavigation";
import MenuTable from "@/components/MenuPage/MenuTable";
import SignInAs from "@/components/MenuPage/SignInAs";
import { useCalorieTracking } from "@/context/calorie-tracking-context";
import { useEffect, useState } from "react";

const DiningHallMenu = () => {
  const [menuDate, setMenuDate] = useState<Date>(new Date());
  const [menuTime, setMenuTime] = useState<string>("");
  const [menuLocation, setMenuLocation] = useState<string>("lakeside");
  const [allergies, setAllergies] = useState<string[]>([]);
  const { clearItems } = useCalorieTracking();

  useEffect(() => {
    clearItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuDate, menuTime, menuLocation]);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center gap-5">
      <SignInAs />
      <div className="max-w-xl mx-auto mt-6 rounded-2xl bg-yellow-100 border-l-4 border-yellow-500 p-4 shadow">
        <p className="text-yellow-800 font-medium">
          ⚠️ Due to late updates from the original dining hall, operations are
          still in progress. Dining hall menus may not be fully accessible at
          this time.
        </p>
      </div>

      <CalorieIndicator
        menuDate={menuDate}
        menuTime={menuTime}
        menuLocation={menuLocation}
      />
      <MenuNavigation
        setMenuDate={setMenuDate}
        setMenuTime={setMenuTime}
        setMenuLocation={setMenuLocation}
        menuDate={menuDate}
        menuTime={menuTime}
        menuLocation={menuLocation}
      />
      <MealTimeSelector
        setMenuTime={setMenuTime}
        menuTime={menuTime}
        menuDate={menuDate}
        menuLocation={menuLocation}
      />
      <MenuFilter setAllergies={setAllergies} />
      <MenuTable
        menuDate={menuDate}
        menuTime={menuTime}
        menuLocation={menuLocation}
        allergies={allergies}
      />
    </div>
  );
};

export default DiningHallMenu;
