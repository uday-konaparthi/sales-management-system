import React, { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";

export default function ProdEditModal({ product, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: "",
    fabricType: "",
    costPrice: "",
    sellPrice: "",
    currentStock: "",
    minStockAlert: 3,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        fabricType: product.fabricType || "",
        costPrice: product.costPrice || "",
        sellPrice: product.sellPrice || "",
        currentStock: product.currentStock || "",
        minStockAlert: product.minStockAlert || 3,
      });
    }
  }, [product]);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BASE_URL}/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update product");
      toast.success("Product updated successfully!");
      onUpdate(data.product);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white/20 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "name", label: "Product Name" },
            { name: "fabricType", label: "Fabric Type" },
            { name: "costPrice", label: "Cost Price", type: "number" },
            { name: "sellPrice", label: "Sell Price", type: "number" },
            { name: "currentStock", label: "Current Stock", type: "number" },
            { name: "minStockAlert", label: "Min Stock Alert", type: "number" },
          ].map((f) => (
            <div key={f.name} className="flex flex-col">
              <label className="text-gray-700 dark:text-gray-300 mb-1">{f.label}</label>
              <input
                type={f.type || "text"}
                name={f.name}
                value={form[f.name]}
                onChange={handleInput}
                required
                className="px-3 py-2 rounded-xl bg-white/30 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-semibold py-2 rounded-xl flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
