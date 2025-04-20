"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { ChevronDown, ChevronUp, Clock, MapPin, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

// Define types for our data structure
interface MenuItem {
  id: number;
  name: string;
  category: string;
  serving_size: string;
  calories_per_serving: number;
}
interface MealItem {
  menu_item: MenuItem;
  quantity: number;
}

interface MealLog {
  id: number;
  date: string;
  meal_time: string;
  meal_location: string;
  meal_items: MealItem[];
  total_calories: number;
}

interface MealsByDate {
  [date: string]: {
    logs: MealLog[];
    totalCalories: number;
    mealTimeBreakdown: {
      [mealTimeLocation: string]: {
        logs: MealLog[];
        totalCalories: number;
        mealTime: string;
        mealLocation: string;
      };
    };
  };
}

interface UserCalorieTableProps {
  mealLogs: MealLog[];
  dailyCalorieGoal?: number;
}

export default function UserCalorieTable({
  mealLogs,
  dailyCalorieGoal = 2000,
}: UserCalorieTableProps) {
  const [expandedDates, setExpandedDates] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedMeals, setExpandedMeals] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const initialExpanded: { [key: string]: boolean } = {};

    mealLogs.forEach((log) => {
      const date = log.date.split("T")[0];
      initialExpanded[date] = true; // 👈 expand by default
    });

    setExpandedDates(initialExpanded);
  }, [mealLogs]);

  const mealsByDate: MealsByDate = mealLogs.reduce((acc, mealLog) => {
    const date = mealLog.date.split("T")[0];

    if (!acc[date]) {
      acc[date] = {
        logs: [],
        totalCalories: 0,
        mealTimeBreakdown: {},
      };
    }

    acc[date].logs.push(mealLog);
    acc[date].totalCalories += mealLog.total_calories;

    // Group by meal time AND location within each date
    const mealTimeLocationKey = `${mealLog.meal_time}-${mealLog.meal_location}`;
    if (!acc[date].mealTimeBreakdown[mealTimeLocationKey]) {
      acc[date].mealTimeBreakdown[mealTimeLocationKey] = {
        logs: [],
        totalCalories: 0,
        mealTime: mealLog.meal_time,
        mealLocation: mealLog.meal_location,
      };
    }

    acc[date].mealTimeBreakdown[mealTimeLocationKey].logs.push(mealLog);
    acc[date].mealTimeBreakdown[mealTimeLocationKey].totalCalories +=
      mealLog.total_calories;

    return acc;
  }, {} as MealsByDate);

  // Toggle expanded state for a date
  const toggleDateExpand = (date: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  // Toggle expanded state for a meal
  const toggleMealExpand = (mealId: string) => {
    setExpandedMeals((prev) => ({
      ...prev,
      [mealId]: !prev[mealId],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(mealsByDate)
          .sort(
            ([dateA], [dateB]) =>
              new Date(dateB).getTime() - new Date(dateA).getTime()
          )
          .map(([date, data]) => (
            <Card key={date} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {format(parseISO(date), "EEEE, MMMM d, yyyy")}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleDateExpand(date)}
                    className="h-8 w-8 p-0"
                  >
                    {expandedDates[date] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {"Total Calories"}
                    </span>
                    <span className="font-medium">
                      {data.totalCalories} / {dailyCalorieGoal} kcal
                    </span>
                  </div>
                  <Progress
                    value={(data.totalCalories / dailyCalorieGoal) * 100}
                  />
                </div>
              </CardHeader>

              <Collapsible open={expandedDates[date]}>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(data.mealTimeBreakdown).map(
                        ([mealTimeLocationKey, mealData]) => (
                          <div
                            key={`${date}-${mealTimeLocationKey}`}
                            className="border rounded-lg overflow-hidden"
                          >
                            <div
                              className="flex justify-between items-center p-3 bg-muted cursor-pointer"
                              onClick={() =>
                                toggleMealExpand(
                                  `${date}-${mealTimeLocationKey}`
                                )
                              }
                            >
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="bg-green-50"
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  {mealData.mealTime}
                                </Badge>
                                <Badge variant="outline" className="bg-blue-50">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {mealData.mealLocation || "Unknown"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-medium">
                                  {mealData.totalCalories} kcal
                                </span>
                                {expandedMeals[
                                  `${date}-${mealTimeLocationKey}`
                                ] ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </div>
                            </div>

                            <Collapsible
                              open={
                                expandedMeals[`${date}-${mealTimeLocationKey}`]
                              }
                            >
                              <CollapsibleContent>
                                <div className="p-3">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Serving Size</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead className="text-right">
                                          Calories
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {mealData.logs.flatMap((log) =>
                                        log.meal_items.map((item, idx) => (
                                          <TableRow
                                            key={`${log.id}-${item.menu_item.id}-${idx}`}
                                          >
                                            <TableCell className="font-medium">
                                              <div className="flex items-center gap-2">
                                                <Utensils className="h-4 w-4 text-green-600" />
                                                {item.menu_item.name}
                                              </div>
                                              <span className="text-xs text-muted-foreground block mt-1">
                                                {item.menu_item.category}
                                              </span>
                                            </TableCell>
                                            <TableCell>
                                              {item.menu_item.serving_size}
                                            </TableCell>
                                            <TableCell>
                                              {item.quantity}
                                            </TableCell>
                                            <TableCell className="text-right">
                                              {item.menu_item
                                                .calories_per_serving *
                                                item.quantity}{" "}
                                              kcal
                                            </TableCell>
                                          </TableRow>
                                        ))
                                      )}
                                      <TableRow>
                                        <TableCell
                                          colSpan={3}
                                          className="text-right font-medium"
                                        >
                                          Total
                                        </TableCell>
                                        <TableCell className="text-right font-bold">
                                          {mealData.totalCalories} kcal
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
      </div>
    </div>
  );
}
