"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import axios from "axios";
import { motion } from "framer-motion";

interface MenuTableProp {
  category: string;
  menu_items: string[];
}

const MenuTable = () => {
  const [menuItems, setmenuItems] = useState<null | MenuTableProp[]>(null);

  useEffect(() => {
    axios.get(`${process.env.BACKEND_URL}/items`).then((res) => {
      setmenuItems(res.data);
    });
  }, []);

  if (!menuItems)
    return (
      <div>
        <p>Loading..</p>
      </div>
    );
  return (
    <div className="w-full">
      {menuItems &&
        menuItems.map((item, key) => (
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
  );
};

const MenuTables: React.FC<{ item: MenuTableProp }> = ({ item }) => {
  const { category, menu_items } = item;

  return (
    <div className=" w-full max-w-3xl bg-white shadow-md rounded-xl p-4 mb-4 border border-green-100 mx-auto">
      <h2 className="text-lg font-semibold text-green-700 mb-3 border-b border-green-200 pb-1 pointer-events-none">
        {category}
      </h2>

      <Table>
        <TableBody>
          {menu_items.map((menu_item, index) => (
            <TableRow
              key={index}
              className="hover:bg-green-50 transition duration-200 "
            >
              <TableCell className="text-green-900 text-sm whitespace-normal  cursor-default">
                {menu_item}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default MenuTable;
