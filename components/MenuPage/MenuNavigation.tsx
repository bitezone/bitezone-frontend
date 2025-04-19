import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDayOfWeek } from "@/lib/htmlUtils";
type MenuNavigationProps = {
  setMenuDate: React.Dispatch<React.SetStateAction<Date>>;
  setMenuTime: React.Dispatch<React.SetStateAction<string>>;
  setMenuLocation: React.Dispatch<React.SetStateAction<string>>;
  menuDate: Date;
  menuTime: string | null;
  menuLocation: string;
};

const MenuNavigation: React.FC<MenuNavigationProps> = ({
  setMenuDate,
  // setMenuTime,
  setMenuLocation,
  menuDate,
  // menuTime,
  menuLocation,
}) => {
  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm p-6 border border-green-100 flex flex-col md:flex-row justify-between items-center gap-4">
      <h1 className="text-2xl font-bold text-green-800 text-center tracking-tight">
        {menuLocation.charAt(0).toUpperCase() + menuLocation.slice(1)} Dining
        Hall
      </h1>
      <div className="flex flex-col md:flex-row items-center gap-5">
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 text-sm rounded-md transition"
            onClick={() => {
              setMenuDate((prev) => {
                const newDate = new Date(prev);
                newDate.setDate(newDate.getDate() - 1);
                return newDate;
              });
            }}
          >
            Prev
          </button>
          <div className="text-green-900 text-center">
            <p className="font-medium">{menuDate.toLocaleDateString()}</p>
            <p className="text-xs text-green-600">{getDayOfWeek(menuDate)}</p>
          </div>
          <button
            className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 text-sm rounded-md transition"
            onClick={() => {
              setMenuDate((prev) => {
                const newDate = new Date(prev);
                newDate.setDate(newDate.getDate() + 1);
                return newDate;
              });
            }}
          >
            Next
          </button>
        </div>
        <div className="">
          <Select value={menuLocation} onValueChange={setMenuLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Dining Hall</SelectLabel>
                <SelectItem value="cooper">Cooper</SelectItem>
                <SelectItem value="lakeside">Lakeside</SelectItem>
                <SelectItem value="pathfinder">Pathfinder</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default MenuNavigation;
