// components/DiningHallMenu.tsx
"use client"
import MealTimeSelector from "@/components/ui/MenuPage/MealTimeSelector";
import MenuNavigation from "@/components/ui/MenuPage/MenuNavigation";
import MenuTable from "@/components/ui/MenuPage/MenuTable";

const DiningHallMenu = () => {
  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col items-center gap-5">
      <MenuNavigation />
      <MealTimeSelector />
      <MenuTable />
    </div>
  );
};

export default DiningHallMenu;
