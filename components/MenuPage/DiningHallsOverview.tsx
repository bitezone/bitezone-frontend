"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiningHallsOverviewProps } from "@/types/dining-hours";
import {
  getAllDiningHallsStatus,
  formatTimeDisplay,
} from "@/lib/diningHoursUtils";

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const DiningHallsOverview: React.FC<DiningHallsOverviewProps> = ({
  currentDate = new Date(),
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const allHallsStatus = getAllDiningHallsStatus(currentDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 text-left hover:bg-green-50 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-green-800">
              All Dining Halls Status
            </h2>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDownIcon className="w-5 h-5 text-green-600" />
            </motion.div>
          </div>
        </button>

        {/* Quick Status Overview (Always Visible) */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {allHallsStatus.map((hall) => (
              <div
                key={hall.hallName}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800">
                    {hall.hallDisplayName.split(" ")[0]}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {hall.status.status === "open" &&
                    hall.status.currentMealPeriod
                      ? hall.status.currentMealPeriod.name
                      : hall.status.nextOpenTime
                      ? `Opens ${formatTimeDisplay(
                          hall.status.nextOpenTime.time
                        )}`
                      : "Closed"}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    hall.status.status === "open"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {hall.status.status === "open" ? "OPEN" : "CLOSED"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed View (Collapsible) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-green-200"
            >
              <div className="p-4 space-y-4">
                {allHallsStatus.map((hall, index) => (
                  <motion.div
                    key={hall.hallName}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-gray-800">
                        {hall.hallDisplayName}
                      </h3>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          hall.status.status === "open"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {hall.status.status === "open" ? "OPEN" : "CLOSED"}
                      </div>
                    </div>

                    {/* Status Details */}
                    {hall.status.status === "open" &&
                    hall.status.currentMealPeriod ? (
                      <div className="space-y-2">
                        <p className="text-sm text-green-700">
                          <span className="font-medium">
                            {hall.status.currentMealPeriod.name}
                          </span>{" "}
                          - Open until{" "}
                          {formatTimeDisplay(hall.status.closingTime!)}
                        </p>

                        {/* Additional Services */}
                        {hall.status.additionalServices &&
                          hall.status.additionalServices.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-600 mb-1">
                                Additional Services:
                              </p>
                              <div className="space-y-1">
                                {hall.status.additionalServices.map(
                                  (service, serviceIndex) => (
                                    <div
                                      key={serviceIndex}
                                      className="text-xs text-gray-700"
                                    >
                                      <span className="font-medium">
                                        {service.name}
                                      </span>
                                      <span className="ml-1">
                                        until{" "}
                                        {formatTimeDisplay(service.closeTime)}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-red-700">Currently Closed</p>
                        {hall.status.nextOpenTime ? (
                          <p className="text-sm text-gray-700">
                            Opens at{" "}
                            {formatTimeDisplay(hall.status.nextOpenTime.time)}{" "}
                            for{" "}
                            <span className="font-medium">
                              {hall.status.nextOpenTime.meal.name}
                            </span>
                          </p>
                        ) : (
                          <p className="text-sm text-gray-700">
                            No scheduled hours today
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DiningHallsOverview;
