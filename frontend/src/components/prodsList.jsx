// components/ProdsList.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProd, setShowProdList } from "@/store/barCodeFetchSlice";
import { X } from "lucide-react";

export default function ProdsList({ onSelect }) {
  const dispatch = useDispatch();
  const { fetchedProds, showProdList } = useSelector((s) => s.barCodeFetch);

  if (!showProdList) return null;

  const handleSelect = (prod) => {
    dispatch(setSelectedProd(prod));
    dispatch(setShowProdList());
    if (onSelect) onSelect(prod);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={() => dispatch(setShowProdList())}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Select Product
          </h2>
          <button
            className="text-gray-400 hover:text-red-500"
            onClick={() => dispatch(setShowProdList())}
          >
            <X size={20} />
          </button>
        </div>

        {fetchedProds && fetchedProds.length > 0 ? (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {fetchedProds.map((prod) => (
              <div
                key={prod._id}
                onClick={() => handleSelect(prod)}
                className="p-4 bg-gray-100 dark:bg-neutral-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all"
              >
                <p className="font-medium text-gray-800 dark:text-gray-100">{prod.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Price: ₹{prod.sellPrice}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Stock: ₹{prod.currentStock}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center">No products found.</p>
        )}
      </div>
    </div>
  );
}
