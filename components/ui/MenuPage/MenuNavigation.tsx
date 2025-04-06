import React from "react";

const MenuNavigation = () => {
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
          <p className="text-xs text-green-600">(Tuesday)</p>
        </div>
        <button className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 text-sm rounded-md transition">
          Next
        </button>
      </div>
    </div>
  );
};

export default MenuNavigation;
