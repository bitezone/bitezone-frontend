import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu } from "lucide-react";
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
        {menuLocation} Dining Hall
      </h1>
      <div className="flex flex-row items-center gap-5">
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
        <div className="hidden md:block">
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
      {/* Dropdown for Selection - for mobile device */}
      <div className="fixed bottom-5 right-5 md:hidden z-50">
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full bg-green-500 hover:bg-green-600 border-2 border-green-700 p-2 flex items-center justify-center shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            <Menu className="text-white h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white p-5 -translate-x-10 rounded-xl shadow-2xl">
            <DropdownMenuLabel>Choose Dining Hall</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={menuLocation}
              onValueChange={setMenuLocation}
            >
              <DropdownMenuRadioItem value="cooper">
                Cooper
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="lakeside">
                Lakeside
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pathfinder">
                Pathfinder
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MenuNavigation;
