"use client";

import React from "react";
import { motion } from "framer-motion";
import { DiningHallStatusCardProps } from "@/types/dining-hours";
import { getDiningHallStatus, formatTimeDisplay } from "@/lib/diningHoursUtils";

const DiningHallStatusCard: React.FC<DiningHallStatusCardProps> = ({
  menuLocation,
  menuDate,
  currentTime = new Date(),
}) => {
  const status = getDiningHallStatus(menuLocation, currentTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-sm border border-green-100 p-3">
        <div className="flex items-center justify-between">
          {/* Status Badge */}
          <motion.div
            key={status.status}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              status.status === "open"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.status === "open" ? "OPEN" : "CLOSED"}
          </motion.div>

          {/* Status Information */}
          <div className="text-right">
            {status.status === "open" && status.currentMealPeriod ? (
              <div className="text-sm text-green-700">
                <span className="font-medium">
                  {status.currentMealPeriod.name}
                </span>
                <span className="text-xs text-green-600 ml-1">
                  until {formatTimeDisplay(status.closingTime!)}
                </span>
              </div>
            ) : (
              <div className="text-sm text-red-700">
                {status.nextOpenTime ? (
                  <span className="text-xs">
                    Opens {formatTimeDisplay(status.nextOpenTime.time)}
                  </span>
                ) : (
                  <span className="text-xs">Closed today</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DiningHallStatusCard;
