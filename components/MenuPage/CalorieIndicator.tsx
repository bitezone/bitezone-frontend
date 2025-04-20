"use client";
import { useCalorieTracking } from "@/context/calorie-tracking-context";
import { useState } from "react";
import { ChevronRight, ChevronLeft, Trash } from "lucide-react";
import { Button } from "../ui/button";

import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
        isExpanded ? "w-80" : "w-15"
      }`}
    >
      <div className="h-full bg-white border-r border-t border-b border-green-100 rounded-l-xl shadow-md flex flex-col">
        <div className=" border-b p-3 border-green-100 flex justify-between items-center bg-green-50 rounded-tl-xl">
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
            <div className=" whitespace-nowrap text-xs font-medium text-green-800">
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
  const { selectedItems, clearItems } = useCalorieTracking();
  const [checkoutState, setCheckoutState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  const handleCalorieCheckout = async () => {
    // Prevent multiple clicks by checking if already in progress
    if (checkoutState !== "idle") return;

    setCheckoutState("loading");

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
      setCheckoutState("success");

      // Reset to idle after showing success for 2 seconds
      setTimeout(() => {
        setCheckoutState("idle");
        clearItems();
      }, 2000);
    } catch (error) {
      console.error("❌ Failed to log meal:", error);
      setCheckoutState("idle");
    }
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 1 }}
      whileHover={{ scale: checkoutState === "idle" ? 1.02 : 1 }}
      whileTap={{ scale: checkoutState === "idle" ? 0.98 : 1 }}
    >
      <Button
        className="w-full relative overflow-hidden"
        onClick={handleCalorieCheckout}
        disabled={checkoutState !== "idle"}
        variant="default"
      >
        <AnimatePresence mode="wait">
          {checkoutState === "idle" && (
            <motion.span
              key="checkout-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              Checkout
            </motion.span>
          )}

          {checkoutState === "loading" && (
            <motion.span
              key="loading"
              className="flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </motion.span>
          )}

          {checkoutState === "success" && (
            <motion.span
              key="success"
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 15,
              }}
            >
              <Check className="mr-2 h-4 w-4" />
              Meal Logged!
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
};
