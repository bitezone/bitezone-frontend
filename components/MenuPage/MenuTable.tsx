"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import axios from "axios";
import { motion } from "framer-motion";
import { decodeHtmlEntities } from "@/lib/htmlUtils";
import { MenuItemNutritionType } from "@/types/menu";
import QuantitySelector from "./CalorieQuantitySelector";

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
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menu`, {
        params: {
          meal_time: menuTime,
          meal_location: menuLocation,
          date: menuDate.toLocaleDateString("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
          format: "json",
        },
      })
      .then((res) => {
        if (res.data.length == 1) {
          const preferredOrder: string[] = [
            "Entree",
            "Accompaniments",
            "Grill Station",
            "Salad of the Day",
            "Panini of the Week",
            "Bakery",
            "Eggs/Breakfast",
            "Soup of the Day",
            "Dessert",
          ];

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
        <p>Data could not be fetched. Please refresh the page.</p>
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

  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);
  const [itemDetails, setItemDetails] = useState<MenuItemNutritionType | null>(
    null
  );


  const fetchItemDetails = async (itemId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/menu-item/${itemId}`
      );
      setItemDetails(response.data);
    } catch (error) {
      console.error("Error fetching menu item details:", error);
    } finally {
    }
  };

  const handleItemClick = (itemId: number) => {
    if (expandedItemId === itemId) {
      // If clicking the same item, collapse it
      setExpandedItemId(null);
      setItemDetails(null);
    } else {
      setExpandedItemId(itemId);
      fetchItemDetails(itemId);
    }
  };

  return (
    <div className=" w-full max-w-3xl bg-white shadow-md rounded-xl p-4 mb-4 border border-green-100 mx-auto">
      <h2 className="text-lg font-semibold text-green-700 mb-3 border-b border-green-200 pb-1 pointer-events-none">
        {decodeHtmlEntities(category)}
      </h2>

      <Table>
        <TableBody>
          {items.map((menu_item, index) => (
            <React.Fragment key={index}>
              <TableRow
                className="hover:bg-green-50 transition duration-200 cursor-pointer"
                onClick={() => handleItemClick(menu_item.item_id)}
              >
                <TableCell className="text-green-900 text-sm whitespace-normal flex flex-row items-center justify-between">
                  <p>{decodeHtmlEntities(menu_item.name)}</p>
                  <QuantitySelector id={menu_item.item_id} />
                </TableCell>
              </TableRow>

              {expandedItemId === menu_item.item_id && (
                <TableRow className="bg-green-50">
                  <TableCell className="px-4 py-3">
                    {itemDetails ? (
                      <div className="pl-4 py-2 text-sm space-y-2">
                        <div className="flex gap-4">
                          <div className="font-medium text-green-800">
                            <span className="font-bold">Serving Size:</span>{" "}
                            {itemDetails.serving_size}
                          </div>
                          <div className="font-medium text-green-800">
                            <span className="font-bold">Calories:</span>{" "}
                            {itemDetails.calories_per_serving}
                          </div>
                        </div>

                        <div>
                          <div className="font-bold text-green-800 mb-1">
                            Ingredients:
                          </div>
                          {itemDetails.ingredients &&
                          itemDetails.ingredients.length > 0 ? (
                            <ul className="list-disc pl-5 text-green-700 text-xs text-wrap">
                              {itemDetails.ingredients.map(
                                (ingredient: string, i: number) => (
                                  <li key={i}>{ingredient}</li>
                                )
                              )}
                            </ul>
                          ) : (
                            <div className="text-xs text-red-500">
                              No ingredients listed
                            </div>
                          )}
                        </div>

                        <div className="mt-2">
                          <div className="font-bold text-green-800 mb-1">
                            Allergies:
                          </div>
                          {itemDetails.allergies &&
                          itemDetails.allergies.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {itemDetails.allergies.map(
                                (allergy: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs"
                                  >
                                    {allergy}
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="text-xs ">No allergies listed</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        Attempting to load...
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default MenuTable;
