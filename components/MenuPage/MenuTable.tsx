"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import axios from "axios";
import { motion } from "framer-motion";
import { decodeHtmlEntities } from "@/lib/htmlUtils";

interface MenuItemProp {
  item_id: number;
  name: string;
  category: string;
}
type MenuTableProps = {
  menuDate: Date;
  menuTime: string;
  menuLocation: string;
};
interface GroupedItems {
  [category: string]: MenuItemProp[];
}

interface DisplayTableOrdered {
  category: string;
  items: MenuItemProp[];
}

const MenuTable: React.FC<MenuTableProps> = ({
  menuDate,
  menuTime,
  menuLocation,
}) => {
  const [menuTable, setMenuTable] = useState<null | DisplayTableOrdered[]>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setMenuTable(null);
    setLoading(true);
    console.log(
      `${
        process.env.BACKEND_URL
      }/api/menu?meal_time=${menuTime}&meal_location=${menuLocation}&date=${menuDate.toLocaleDateString(
        "en-CA",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      )}`
    );
    axios
      .get(`${process.env.BACKEND_URL}/api/menu`, {
        params: {
          meal_time: menuTime,
          meal_location: menuLocation,
          date: menuDate.toLocaleDateString("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
        },
      })
      .then((res) => {
        if (res.data.length == 1) {
          const preferredOrder: string[] = [
            "Entree",
            "Accompaniments",
            "Dessert",
          ]; // Customize this

          // Group menu items by category
          const grouped: GroupedItems = res.data[0]["menu_items"].reduce(
            (acc: GroupedItems, item: MenuItemProp) => {
              if (!acc[item.category]) {
                acc[item.category] = [];
              }
              acc[item.category].push(item);
              return acc;
            },
            {}
          );

          // Create the ordered groups with custom order for preferred categories
          const displayTableOrderedLi: DisplayTableOrdered[] = [
            ...preferredOrder
              .filter((category) => grouped[category]) // only include if the category exists
              .map((category) => ({
                category,
                items: grouped[category],
              })),
            ...Object.entries(grouped)
              .filter(([category]) => !preferredOrder.includes(category))
              .map(([category, items]) => ({
                category,
                items,
              })),
          ];

          setMenuTable(displayTableOrderedLi);
        }

        setLoading(false);
      });
  }, [menuDate, menuLocation, menuTime]);

  if (loading)
    return (
      <div>
        <p>Loading..</p>
      </div>
    );

  if (!menuTable) {
    return (
      <div>
        <p>Data could not be fetched</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {menuTable &&
        menuTable.map((item, key) => (
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

const MenuTables: React.FC<{ item: DisplayTableOrdered }> = ({ item }) => {
  const { category, items } = item;

  return (
    <div className=" w-full max-w-3xl bg-white shadow-md rounded-xl p-4 mb-4 border border-green-100 mx-auto">
      <h2 className="text-lg font-semibold text-green-700 mb-3 border-b border-green-200 pb-1 pointer-events-none">
        {category}
      </h2>

      <Table>
        <TableBody>
          {items.map((menu_item, index) => (
            <TableRow
              key={index}
              className="hover:bg-green-50 transition duration-200 "
            >
              <TableCell className="text-green-900 text-sm whitespace-normal  cursor-default">
                {decodeHtmlEntities(menu_item.name)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default MenuTable;
