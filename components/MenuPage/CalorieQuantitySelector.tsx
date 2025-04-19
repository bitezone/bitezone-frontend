import React from "react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
}) => {
  return (
    <div
      className="flex items-center gap-4
    "
      onClick={(e) => e.stopPropagation()}
    >
      <span className="hidden sm:block font-medium text-green-700">
        Amount:
      </span>
      <div className="flex items-center border border-green-300 rounded overflow-hidden">
        <button
          onClick={onDecrease}
          className="px-2 py-1 text-green-800 bg-green-100 hover:bg-green-200"
        >
          −
        </button>
        <span className="px-3">{quantity}</span>
        <button
          onClick={onIncrease}
          className="px-2 py-1 text-green-800 bg-green-100 hover:bg-green-200"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
