"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  getAllDiningHallsStatus,
  formatTimeDisplay,
} from "@/lib/diningHoursUtils";
import { DiningHallName } from "@/types/dining-hours";

interface DiningHallsStatusModalProps {
  currentDate?: Date;
}

const DiningHallsStatusModal: React.FC<DiningHallsStatusModalProps> = ({
  currentDate = new Date(),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const allHallsStatus = getAllDiningHallsStatus(currentDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200";
      case "open-limited":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "closed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "OPEN";
      case "open-limited":
        return "OPEN Limited";
      case "closed":
        return "CLOSED";
      default:
        return "UNKNOWN";
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        All Dining Halls Status
      </button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsOpen(false)}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-green-800">
                    All Dining Halls Status
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentDate.toLocaleDateString()} •{" "}
                    {currentDate.toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {allHallsStatus.map((hall, index) => (
                  <motion.div
                    key={hall.hallName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    {/* Hall Header */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {hall.hallDisplayName}
                      </h3>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(
                          hall.status.status
                        )}`}
                      >
                        {getStatusText(hall.status.status)}
                      </div>
                    </div>

                    {/* Status Details */}
                    {(hall.status.status === "open" ||
                      hall.status.status === "open-limited") &&
                    hall.status.currentMealPeriod ? (
                      <div className="space-y-2">
                        <div className="text-green-700">
                          <span className="font-medium">
                            {hall.status.currentMealPeriod.name}
                          </span>{" "}
                          - Open until{" "}
                          <span className="font-medium">
                            {formatTimeDisplay(hall.status.closingTime!)}
                          </span>
                        </div>

                        {hall.status.status === "open-limited" && (
                          <div className="text-yellow-700 text-sm bg-yellow-50 p-2 rounded border border-yellow-200">
                            ⚠️ Limited service available (additional services
                            only)
                          </div>
                        )}

                        <div className="text-sm text-gray-600">
                          <strong>Hours:</strong>{" "}
                          {formatTimeDisplay(
                            hall.status.currentMealPeriod.openTime
                          )}{" "}
                          - {formatTimeDisplay(hall.status.closingTime!)}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-red-700 font-medium">
                          Currently Closed
                        </div>
                        {hall.status.nextOpenTime ? (
                          <div className="text-sm text-gray-700">
                            <div>
                              <strong>Next Opens:</strong>{" "}
                              {formatTimeDisplay(hall.status.nextOpenTime.time)}
                            </div>
                            <div>
                              <strong>For:</strong>{" "}
                              {hall.status.nextOpenTime.meal.name}
                            </div>
                            <div>
                              <strong>Hours:</strong>{" "}
                              {formatTimeDisplay(
                                hall.status.nextOpenTime.meal.openTime
                              )}{" "}
                              -{" "}
                              {formatTimeDisplay(
                                hall.status.nextOpenTime.meal.closeTime
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-700">
                            No scheduled hours today
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Open</span>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full ml-4"></span>
                    <span>Limited</span>
                    <span className="w-2 h-2 bg-red-500 rounded-full ml-4"></span>
                    <span>Closed</span>
                  </div>
                  <div className="text-xs text-gray-500">Beta Testing</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DiningHallsStatusModal;
