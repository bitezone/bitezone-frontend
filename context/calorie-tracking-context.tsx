"use client";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import { MenuItemCartContext } from "@/types/calorie-tracking";
import axios from "axios";

type SelectedItemsContextType = {
  selectedItems: MenuItemCartContext[];
  updateItemAmount: (item_id: number, amountChange: number) => void;
  clearItems: () => void;
  totalCalories: number;
  getItem: (id: number) => MenuItemCartContext | undefined;
};

const SelectedItemsContext = createContext<
  SelectedItemsContextType | undefined
>(undefined);

export const SelectedItemsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedItems, setSelectedItems] = useState<MenuItemCartContext[]>([]);
  const updateItemAmount = async (item_id: number, amountChange: number) => {
    // Check if the item already exists
    const existing = selectedItems.find((i) => i.id === item_id);

    if (existing) {
      const newAmount = existing.amount + amountChange;

      if (newAmount <= 0) {
        setSelectedItems((prev) => prev.filter((i) => i.id !== item_id));
      } else {
        setSelectedItems((prev) =>
          prev.map((i) => (i.id === item_id ? { ...i, amount: newAmount } : i))
        );
      }
    } else if (amountChange > 0) {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menu-item/${item_id}`
        );
        const data = res.data;
        const newItem: MenuItemCartContext = {
          id: data.id,
          name: data.name,
          category: data.category,
          serving_size: data.serving_size,
          calories_per_serving: data.calories_per_serving,
          amount: amountChange,
        };

        setSelectedItems((prev) => [...prev, newItem]);
      } catch (err) {
        console.error("Failed to fetch item details:", err);
      }
    }
  };
  const clearItems = () => {
    setSelectedItems([]);
  };

  const totalCalories = useMemo(() => {
    return selectedItems.reduce(
      (acc, item) => acc + item.calories_per_serving * item.amount,
      0
    );
  }, [selectedItems]);

  const getItem = (id: number): MenuItemCartContext | undefined => {
    return selectedItems.find((i) => i.id === id);
  };
  
  return (
    <SelectedItemsContext.Provider
      value={{
        selectedItems,
        updateItemAmount,
        clearItems,
        totalCalories,
        getItem,
      }}
    >
      {children}
    </SelectedItemsContext.Provider>
  );
};

export const useCalorieTracking = () => {
  const context = useContext(SelectedItemsContext);
  if (!context)
    throw new Error(
      "useCalorieTracking must be used inside SelectedItemsProvider"
    );
  return context;
};
