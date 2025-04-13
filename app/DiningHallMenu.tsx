// components/DiningHallMenu.tsx
"use client";
import MealTimeSelector from "@/components/MenuPage/MealTimeSelector";
import MenuNavigation from "@/components/MenuPage/MenuNavigation";
import MenuTable from "@/components/MenuPage/MenuTable";
import { useState } from "react";

const DiningHallMenu = () => {
  const [menuDate, setMenuDate] = useState<Date>(new Date());
  const [menuTime, setMenuTime] = useState<string>("");
  const [menuLocation, setMenuLocation] = useState<string>("lakeside");
  const googleSignInUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&prompt=consent&response_type=code&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&scope=openid%20email%20profile&access_type=offline`;

  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col items-center gap-5">
      <div style={{ padding: 20 }}>
        <a href={googleSignInUrl}>Sign in with Google</a>
      </div>
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
      <MenuTable
        menuDate={menuDate}
        menuTime={menuTime}
        menuLocation={menuLocation}
      />
    </div>
  );
};

export default DiningHallMenu;
