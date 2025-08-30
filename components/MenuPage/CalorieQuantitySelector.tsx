"use client";
import { useCalorieTracking } from "@/context/calorie-tracking-context";
import React from "react";

interface QuantitySelectorProps {
  id: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ id }) => {
  const { updateItemAmount, getItem } = useCalorieTracking();

  return (
    <div
      className="flex items-center gap-4
    "
      onClick={(e) => e.stopPropagation()}
    >
      <span className="hidden sm:block font-medium text-green-700">
        Amount:
      </span>
      <div className="flex items-center border border-green-300 rounded overflow-hidden">
        <button
          onClick={() => {
            updateItemAmount(id, -1);
          }}
          className="px-2 py-1 text-green-800 bg-green-100 hover:bg-green-200"
        >
          −
        </button>
        <span className="px-3">{getItem(id)?.amount ?? 0}</span>
        <button
          onClick={() => {
            updateItemAmount(id, 1);
          }}
          className="px-2 py-1 text-green-800 bg-green-100 hover:bg-green-200"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
