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
      <SignInAs currentDate={menuDate} />
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
