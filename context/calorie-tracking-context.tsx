"use client"

import { MenuItemCartContext } from "@/types/calorie-tracking";
import React, { createContext, useContext, useState } from "react";

type SelectedItemsContextType = {
  selectedItems: MenuItemCartContext[];
  addItem: (item: MenuItemCartContext) => void;
  removeItem: (id: number) => void;
  clearItems: () => void;
};

const SelectedItemsContext = createContext<
  SelectedItemsContextType | undefined
>(undefined);

export const SelectedItemsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedItems, setSelectedItems] = useState<MenuItemCartContext[]>([]);

  const addItem = (item: MenuItemCartContext) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  const removeItem = (id: number) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearItems = () => {
    setSelectedItems([]);
  };

  return (
    <SelectedItemsContext.Provider
      value={{ selectedItems, addItem, removeItem, clearItems }}
    >
      {children}
    </SelectedItemsContext.Provider>
  );
};

export const useSelectedItems = () => {
  const context = useContext(SelectedItemsContext);
  if (!context)
    throw new Error(
      "useSelectedItems must be used inside SelectedItemsProvider"
    );
  return context;
};
