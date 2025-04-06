"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Coffee, Menu, Utensils, UtensilsCrossed } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "../tabs";

const MealTimeSelector = () => {
  const [location, setLocation] = useState("lakeside");
  return (
    <div className="w-full max-w-3xl">
      <Card className="hidden md:flex shadow-sm  bg-white rounded-xl p-6 border border-green-100  flex-col md:flex-row justify-between items-center gap-4">
        <CardContent className="p-4 w-full">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-green-700" />
            <h2 className="font-medium text-green-800">Select Meal Time</h2>
          </div>

          {/* Starting from medium device */}
          <Tabs defaultValue="lunch">
            <TabsList className="grid grid-cols-3 bg-green-50 w-full">
              <TabsTrigger
                value="Breakfast"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex flex-row items-center"
              >
                <Coffee className="h-4 w-4 mr-2" />
                Breakfast
              </TabsTrigger>
              <TabsTrigger
                value="Lunch"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex flex-row items-center"
              >
                <Utensils className="h-4 w-4 mr-2" />
                Lunch
              </TabsTrigger>
              <TabsTrigger
                value="Dinner"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex flex-row items-center"
              >
                <UtensilsCrossed className="h-4 w-4 mr-2" />
                Dinner
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
      <div className="fixed bottom-5 right-5 md:hidden z-50">
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full bg-green-500 hover:bg-green-600 border-2 border-green-700 p-2 flex items-center justify-center shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            <Menu className="text-white h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white p-5 -translate-x-10 rounded-xl shadow-2xl">
            <DropdownMenuLabel>Choose Location</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={location}
              onValueChange={setLocation}
            >
              <DropdownMenuRadioItem value="cooper">
                Cooper
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="lakeside">
                Lakeside
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MealTimeSelector;
