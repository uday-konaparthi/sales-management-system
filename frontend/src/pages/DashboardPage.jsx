import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  ArrowUp,
  ArrowDown,
  BarChart3,
  DollarSign,
  Percent,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const user = useSelector((state) => state.auth.user);
  const [sales, setSales] = useState([]);
  const [range, setRange] = useState("weekly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSales() {
      if (!user) return;
      setLoading(true);
      setError("");

      try {
        const BASE_URL = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(
          `${BASE_URL}/api/sales?range=${range}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch sales data");

        const data = await res.json();
        setSales(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSales();
  }, [user, range]);

  // ✅ Derived Stats
  const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalProfit = sales.reduce((acc, s) => acc + s.totalProfit, 0);
  const totalOrders = sales.length;

  return (
    <div className="min-h-screen transition-colors duration-300 px-6 py-8 bg-gray-50 dark:bg-black/80 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 size={40} className="animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              {
                title: "Total Revenue",
                value: `₹${totalRevenue.toLocaleString()}`,
                color: "text-green-600 dark:text-green-400",
                icon: <DollarSign size={20} />,
                change: "+12%",
              },
              {
                title: "Total Profit",
                value: `₹${totalProfit.toLocaleString()}`,
                color: "text-blue-600 dark:text-blue-400",
                icon: <Percent size={20} />,
                change: "+8%",
              },
              {
                title: "Total Orders",
                value: totalOrders,
                color: "text-yellow-500 dark:text-yellow-400",
                icon: <BarChart3 size={20} />,
                change: "-2%",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {card.title}
                  </h3>
                  <span className={card.color}>{card.icon}</span>
                </div>
                <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  {card.change.includes("+") ? (
                    <ArrowUp size={14} />
                  ) : (
                    <ArrowDown size={14} />
                  )}
                  {card.change} from last {range}
                </p>
              </div>
            ))}
          </div>

          {/* Recent Sales Table */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Recent Sales
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-gray-600 dark:text-gray-300 border-b dark:border-slate-700">
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Total Amount</th>
                    <th className="py-3 px-4 text-left">Total Profit</th>
                    <th className="py-3 px-4 text-left">Items Sold</th>
                  </tr>
                </thead>

                <tbody>
                  {sales.length ? (
                    sales.slice(0, 5).map((sale, idx) => (
                      <tr
                        key={idx}
                        className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                      >
                        <td className="py-2 px-4">
                          {new Date(sale.soldAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 text-green-500">
                          ₹{sale.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-2 px-4 text-blue-400">
                          ₹{sale.totalProfit.toLocaleString()}
                        </td>
                        <td className="py-2 px-4">
                          {sale.totalItems || sale.products?.length || 0}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-gray-400">
                        No sales data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
