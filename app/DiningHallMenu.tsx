// components/DiningHallMenu.tsx
"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { menuItems } from "@/data/menu";
import { motion } from "framer-motion";

import React from "react"; 

// 🌿 Main Dining Menu Component
const DiningHallMenu = () => {
  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col items-center gap-6">
      <Navigation />
      <div className="w-full">
        {menuItems.map((item, key) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: key * 0.1 }}
            className="w-full max-w-5xl mx-auto"
          >
            <MenuTables item={item} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// 🍽️ Top Navigation
const Navigation = () => {
  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm p-6 border border-green-100 flex flex-col md:flex-row justify-between items-center gap-4">
      <h1 className="text-2xl font-bold text-green-800 text-center tracking-tight">
        Lakeside Dining Hall
      </h1>
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 text-sm rounded-md transition">
          Prev
        </button>
        <div className="text-green-900 text-center">
          <p className="font-medium">April 2, 2024</p>
          <p className="text-sm text-green-600">(Tuesday)</p>
        </div>
        <button className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 text-sm rounded-md transition">
          Next
        </button>
      </div>
    </div>
  );
};

// 📝 Menu Table Component
interface MenuTableProp {
  category: string;
  menu_items: string[];
}

const MenuTables: React.FC<{ item: MenuTableProp }> = ({ item }) => {
  const { category, menu_items } = item;

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mt-4 border border-green-100">
      <h2 className="text-lg font-semibold text-green-700 mb-3 border-b border-green-200 pb-1">
        {category}
      </h2>

      <Table>
        <TableBody>
          {menu_items.map((menu_item, index) => (
            <TableRow
              key={index}
              className="hover:bg-green-50 transition duration-200"
            >
              <TableCell className="text-green-900 text-sm whitespace-normal">
                {menu_item}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DiningHallMenu;
