// components/DiningHallMenu.tsx

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { menuItems } from "@/data/menu";

import React from "react";

const DiningHallMenu = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center gap-5">
      <Navigation />

      {menuItems.map((item, key) => (
        <div key={key}>
          <MenuTables item={item} />
        </div>
      ))}
    </div>
  );
};

const Navigation = () => {
  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Lakeside Dining Hall
      </h1>
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded-lg transition">
          Prev
        </button>
        <div className="text-gray-700 md:font-medium flex flex-col items-center">
          <p>April 2, 2024 </p>
          <p className="text-sm text-gray-500">(Tuesday)</p>
        </div>
        <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded-lg transition">
          Next
        </button>
      </div>
    </div>
  );
};

interface MenuTableProp {
  category: string;
  menu_items: string[];
}

const MenuTables: React.FC<{ item: MenuTableProp }> = ({ item }) => {
  const { category, menu_items } = item;
  return (
    <div className="mx-4 lg:mx-12 xl:mx-24">
      <div>
        <p className="mx-auto w-fit">{category}</p>
      </div>
      <Table>
        <TableBody>
          {menu_items.map((menu_item, key) => (
            <TableRow key={key}>
              <TableCell className=" whitespace-normal">{menu_item}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DiningHallMenu;
