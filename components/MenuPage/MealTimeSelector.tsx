"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
type MealTimeSelectorProps = {
  setMenuTime: React.Dispatch<React.SetStateAction<string>>;
  menuTime: string;
  menuDate: Date;
  menuLocation: string;
};

interface MenuBasic {
  id: number;
  date: string;
  meal_location: string;
  meal_time: string;
}

const MealTimeSelector: React.FC<MealTimeSelectorProps> = ({
  setMenuTime,
  menuTime,
  menuDate,
  menuLocation,
}) => {
  const [availableMenuTimes, setAvailableMenuTimes] = useState<string[] | null>(
    null
  );
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menu/get_menu_times`, {
        params: {
          meal_location: menuLocation,
          date: menuDate.toLocaleDateString("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
        },
      })
      .then((res) => {
        const arr: string[] = [];
        res.data.forEach((menuTimeObject: MenuBasic) => {
          arr.push(menuTimeObject.meal_time);
        });
        setAvailableMenuTimes(arr);
      });
  }, [menuDate, menuLocation]);

  useEffect(() => {
    if (
      availableMenuTimes &&
      availableMenuTimes.length > 0 &&
      !availableMenuTimes.includes(menuTime)
    ) {
      setMenuTime(availableMenuTimes[0]);
    }
  }, [availableMenuTimes, menuTime, setMenuTime]);
  return (
    <div className="w-full max-w-3xl">
      <Card className=" shadow-sm  bg-white rounded-xl p-6 border border-green-100  flex-col md:flex-row justify-between items-center gap-4">
        <CardContent className=" p-4 w-full">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <Clock className="h-4 w-4 text-green-700" />
            <h2 className="font-medium text-green-800">
              Select Meal Time: {menuTime}
            </h2>
          </div>

          {/* Starting from medium device */}
          <Tabs
            value={menuTime}
            onValueChange={setMenuTime}
            className="hidden md:flex"
          >
            <TabsList className="w-full bg-green-50">
              {availableMenuTimes &&
                availableMenuTimes.map((item, index) => (
                  <TabsTrigger
                    value={item}
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex flex-row items-center"
                    key={index}
                  >
                    {item}
                  </TabsTrigger>
                ))}
            </TabsList>
          </Tabs>

          <div className="md:hidden flex justify-center">
            <Select value={menuTime} onValueChange={setMenuTime}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Meals</SelectLabel>
                  {availableMenuTimes &&
                    availableMenuTimes.map((item, index) => (
                      <SelectItem value={item} key={index}>
                        {item}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MealTimeSelector;
