"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Coffee, Utensils, UtensilsCrossed } from "lucide-react";
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
type MealTimeSelectorProps = {
  setMenuTime: React.Dispatch<React.SetStateAction<string>>;
  menuTime: string;
};

const MealTimeSelector: React.FC<MealTimeSelectorProps> = ({
  setMenuTime,
  menuTime,
}) => {
  return (
    <div className="w-full max-w-3xl">
      <Card className=" shadow-sm  bg-white rounded-xl p-6 border border-green-100  flex-col md:flex-row justify-between items-center gap-4">
        <CardContent className=" p-4 w-full">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <Clock className="h-4 w-4 text-green-700" />
            <h2 className="font-medium text-green-800">Select Meal Time</h2>
          </div>

          {/* Starting from medium device */}
          <Tabs
            value={menuTime}
            onValueChange={setMenuTime}
            className="hidden md:flex"
          >
            <TabsList className="grid grid-cols-3 bg-green-50 w-full">
              <TabsTrigger
                value="breakfast"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex flex-row items-center"
              >
                <Coffee className="h-4 w-4 mr-2" />
                Breakfast
              </TabsTrigger>
              <TabsTrigger
                value="lunch"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex flex-row items-center"
              >
                <Utensils className="h-4 w-4 mr-2" />
                Lunch
              </TabsTrigger>
              <TabsTrigger
                value="dinner"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex flex-row items-center"
              >
                <UtensilsCrossed className="h-4 w-4 mr-2" />
                Dinner
              </TabsTrigger>
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
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
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
