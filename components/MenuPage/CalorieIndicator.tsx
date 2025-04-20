"use client";
import { useCalorieTracking } from "@/context/calorie-tracking-context";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, Trash } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import api from "@/lib/authentication/handleToken";

type MenuItemCartContext = {
  id: number;
  name: string;
  category: string;
  calories_per_serving: number;
  serving_size: string;
  amount: number;
};

interface CalorieIndicatorProps {
  menuDate: Date;
  menuTime: string;
  menuLocation: string;
}

const CalorieIndicator = ({
  menuDate,
  menuTime,
  menuLocation,
}: CalorieIndicatorProps) => {
  const { totalCalories, selectedItems, clearItems } = useCalorieTracking();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`fixed right-0 top-1/8 z-50 transition-all duration-300 ${
        isExpanded ? "w-80" : "w-20"
      }`}
    >
      <div className="h-full bg-white border-r border-t border-b border-green-100 rounded-r-xl shadow-md flex flex-col">
        {/* Header with toggle button */}
        <div className="p-3 border-b border-green-100 flex justify-between items-center bg-green-50 rounded-tr-xl">
          {isExpanded ? (
            <>
              <h3 className="font-bold text-green-800">Calorie Tracker</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-green-100 rounded-full"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-5 w-5 text-green-700" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full flex justify-center hover:bg-green-100 rounded-md p-1"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-5 w-5 text-green-700" />
            </button>
          )}
        </div>

        {/* Calorie indicator */}
        <div className="p-3 flex flex-col items-center">
          {isExpanded ? (
            <div className="w-full text-center">
              <span className="font-medium text-green-800">
                Total Calories:
              </span>
              <div className="text-2xl font-bold text-green-600">
                {totalCalories || 0}
              </div>
            </div>
          ) : (
            <div className=" whitespace-nowrap text-sm font-medium text-green-800">
              {totalCalories || 0} Cal
            </div>
          )}
        </div>

        {isExpanded && selectedItems && selectedItems.length > 0 && (
          <div className="flex-1 overflow-y-auto p-3 max-h-100">
            <div className="flex flex-row justify-between">
              <h4 className="font-medium text-green-800 mb-2">
                Selected Items:
              </h4>
              <button
                onClick={() => {
                  clearItems();
                }}
              >
                <Trash />
              </button>
            </div>
            <ul className="space-y-2">
              {selectedItems.map((item: MenuItemCartContext) => (
                <li
                  key={item.id}
                  className="bg-green-50 p-2 rounded-md text-sm flex justify-between"
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-green-700">
                      {item.serving_size} × {item.amount}
                    </div>
                  </div>
                  <div className="text-green-600 font-medium">
                    {item.calories_per_serving * item.amount} cal
                  </div>
                </li>
              ))}
            </ul>
            <CheckoutOperation
              menuDate={menuDate}
              menuTime={menuTime}
              menuLocation={menuLocation}
            />
          </div>
        )}

        {isExpanded && (!selectedItems || selectedItems.length === 0) && (
          <div className="flex-1 p-3 flex items-center justify-center text-green-600 text-sm italic">
            No items selected
          </div>
        )}
      </div>
    </div>
  );
};

export default CalorieIndicator;

const CheckoutOperation = ({
  menuDate,
  menuTime,
  menuLocation,
}: CalorieIndicatorProps) => {
  const { selectedItems } = useCalorieTracking();
  const handleCalorieCheckout = async () => {
    console.log(
      menuDate.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    );
    const payload = {
      date: menuDate.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      meal_time: menuTime,
      meal_location: menuLocation,
      meal_items: selectedItems.map((item) => ({
        menu_item_id: item.id,
        quantity: item.amount,
      })),
    };

    try {
      const response = await api.post("/users/meal-logs/", payload);
      console.log("✅ Meal logged:", response.data);
    } catch (error) {
      console.error("❌ Failed to log meal:", error);
    }
  };

  useEffect(() => {
    console.log(menuDate);
  }, [menuDate]);

  return (
    <Button
      className="w-full"
      onClick={() => {
        handleCalorieCheckout();
      }}
    >
      Checkout
    </Button>
  );
};
