import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Loader, Package, Plus, X, Download, Trash2, Edit, Upload } from "lucide-react";
import { Search } from "lucide-react";
import ProdEditModal from "@/components/prodEdit";

export default function ProductsPage() {
  const { user } = useSelector((s) => s.auth)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [barcodeImages, setBarcodeImages] = useState({})

  const [form, setForm] = useState({
    name: "",
    fabricType: "",
    costPrice: "",
    sellPrice: "",
    currentStock: "",
    minStockAlert: 3,
  })

  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const BASE_URL = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${BASE_URL}/api/products`, {
          credentials: 'include',
        });
        const data = await res.json();
        console.log("PRODUCTS-LIST : ", data)
        setProducts(data);

        // Generate barcode images for all products
        data.forEach(product => {
          if (product.barcode) {
            generateBarcodeImage(product.barcode);
          }
        });
      } catch (err) {
        toast.error(err.message);
      }
      setLoading(false);
    }
    if (user) fetchProducts();
  }, [user]);

  const generateBarcodeImage = async (barcode) => {
    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BASE_URL}/api/barcode/generate?text=${barcode}`, {
        credentials: 'include'
      });

      if (res.ok) {
        const blob = await res.blob();
        const imageUrl = URL.createObjectURL(blob);
        setBarcodeImages(prev => ({ ...prev, [barcode]: imageUrl }));
      }
    } catch (err) {
      console.error('Failed to generate barcode:', err);
    }
  };

  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    console.log(form)
    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      setProducts([data.product, ...products]);

      // Generate barcode image for new product
      if (data.product.barcode) {
        generateBarcodeImage(data.product.barcode);
      }

      toast.success(data.message || "Product added!");
      setForm({
        name: "",
        fabricType: "",
        costPrice: "",
        sellPrice: "",
        currentStock: "",
        minStockAlert: 3,
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const [editingProduct, setEditingProduct] = useState(null);

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;

    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to delete product');

      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDownloadBarcode = async (barcode, name) => {
    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BASE_URL}/api/barcode/generate?text=${barcode}`, {
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to download barcode');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `barcode-${name}-${barcode}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Barcode downloaded');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredProducts = products.filter((p) => {
    const searchLower = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(searchLower) ||
      (p.fabricType && p.fabricType.toLowerCase().includes(searchLower)) ||
      p.costPrice.toString().includes(searchLower) ||
      p.sellPrice.toString().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen text-[var(--color-text)] px-8 pt-8 pb-32 transition-colors"
      style={{ backgroundColor: 'var(--color-background)' }}>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-bold flex items-center gap-3"
          style={{
            color: 'var(--color-text)',
            letterSpacing: 'var(--letter-spacing-tight)'
          }}>
          <Package size={28} style={{ color: 'var(--color-primary)' }} />
          Product Inventory
        </h2>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-text-secondary)' }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-10 py-2 rounded-lg text-sm transition-all outline-none"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-family-base)',
                minWidth: '250px',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary)';
                e.target.style.boxShadow = 'var(--focus-ring)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-all"
                style={{ color: 'var(--color-text-secondary)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-secondary-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <p className="text-sm font-medium px-3 py-1.5 rounded-full whitespace-nowrap"
            style={{
              color: 'var(--color-text-secondary)',
              backgroundColor: 'var(--color-secondary)',
              border: '1px solid var(--color-border)'
            }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>

      {/* Product table */}
      <div className="rounded-lg overflow-hidden mx-3"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-card-border)',
          boxShadow: 'var(--shadow-md)'
        }}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead style={{ backgroundColor: 'var(--color-secondary)' }}>
              <tr className="text-left" style={{ color: 'var(--color-text)' }}>
                <th className="py-3 px-6 font-semibold">Barcode</th>
                <th className="py-3 px-6 font-semibold">Name</th>
                <th className="py-3 px-6 font-semibold">Fabric</th>
                <th className="py-3 px-6 font-semibold">Cost Price</th>
                <th className="py-3 px-6 font-semibold">Sell Price</th>
                <th className="py-3 px-6 font-semibold">Stock</th>
                <th className="py-3 px-6 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center">
                    <div className="flex items-center justify-center gap-2"
                      style={{ color: 'var(--color-text-secondary)' }}>
                      <Loader className="animate-spin" size={20} />
                      <span>Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr
                    key={p._id}
                    className="group transition-colors"
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-secondary-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td className="py-1 px-3">
                      <div className="flex flex-col items-start gap-2">
                        {barcodeImages[p.barcode] ? (
                          <img
                            src={barcodeImages[p.barcode]}
                            alt={p.barcode}
                            className="rounded"
                            style={{
                              maxWidth: '120px',
                              height: 'auto',
                              border: '1px solid var(--color-border)',
                              padding: '4px',
                              backgroundColor: 'var(--color-white)'
                            }}
                          />
                        ) : (
                          <div className="px-3 py-2 rounded flex items-center gap-2"
                            style={{
                              backgroundColor: 'var(--color-secondary)',
                              color: 'var(--color-text-secondary)'
                            }}>
                            <Loader className="animate-spin" size={14} />
                            <span className="text-xs">Loading...</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-6 font-medium"
                      style={{
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text)'
                      }}>
                      {p.name}
                    </td>

                    <td className="py-3 px-6" style={{ color: 'var(--color-text)' }}>
                      {p.fabricType || "-"}
                    </td>

                    <td className="py-3 px-6 font-medium"
                      style={{
                        color: 'var(--color-success)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}>
                      ₹{Number(p.costPrice).toLocaleString()}
                    </td>

                    <td className="py-3 px-6 font-medium"
                      style={{
                        color: 'var(--color-success)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}>
                      ₹{Number(p.sellPrice).toLocaleString()}
                    </td>

                    <td className="py-3 px-6">
                      <span
                        className="px-2.5 py-1 text-xs font-semibold rounded-full inline-block"
                        style={{
                          backgroundColor: p.currentStock < p.minStockAlert
                            ? 'rgba(var(--color-error-rgb), var(--status-bg-opacity))'
                            : 'rgba(var(--color-success-rgb), var(--status-bg-opacity))',
                          color: p.currentStock < p.minStockAlert
                            ? 'var(--color-error)'
                            : 'var(--color-success)',
                          border: `1px solid ${p.currentStock < p.minStockAlert
                            ? 'rgba(var(--color-error-rgb), var(--status-border-opacity))'
                            : 'rgba(var(--color-success-rgb), var(--status-border-opacity))'
                            }`,
                          fontWeight: 'var(--font-weight-semibold)'
                        }}
                      >
                        {p.currentStock}
                      </span>
                    </td>

                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1.5 rounded transition-all"
                          style={{ color: 'var(--color-primary)' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-secondary-hover)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          title="Edit product"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDownloadBarcode(p.barcode, p.name)}
                          className="p-1.5 rounded transition-all"
                          style={{ color: 'var(--color-primary)' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-secondary-hover)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          title="Download barcode"
                        >
                          <Download size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-1.5 rounded transition-all"
                          style={{ color: 'var(--color-error)' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-secondary-hover)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fixed bottom add product form - SIMPLE VERSION */}
      <div
        className="fixed bottom-0 right-0 left-0 p-6 backdrop-blur-xs bg-white/60 dark:bg-black/90"
        style={{
          borderTop: '1px solid var(--color-border)',
          boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-8 gap-3 max-w-7xl mx-auto">
          <input
            name="name"
            value={form.name}
            onChange={handleInput}
            placeholder="Product Name"
            required
            className="col-span-2 form-control px-3 py-2 rounded-lg text-sm border border-black dark:border-gray-400"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
            }}
          />

          <input
            name="fabricType"
            value={form.fabricType}
            onChange={handleInput}
            placeholder="Fabric Type"
            className="col-span-1 form-control px-3 py-2 rounded-lg text-sm border border-black dark:border-gray-400"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
            }}
          />

          <input
            name="costPrice"
            type="number"
            value={form.costPrice}
            onChange={handleInput}
            placeholder="Cost Price"
            required
            className="col-span-1 form-control px-3 py-2 rounded-lg text-sm border border-black dark:border-gray-400"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
            }}
          />

          <input
            name="sellPrice"
            type="number"
            value={form.sellPrice}
            onChange={handleInput}
            placeholder="Sell Price"
            required
            className="col-span-1 form-control px-3 py-2 rounded-lg text-sm border border-black dark:border-gray-400"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
            }}
          />

          <input
            name="currentStock"
            type="number"
            value={form.currentStock}
            onChange={handleInput}
            placeholder="Stock Qty"
            required
            className="col-span-1 form-control px-3 py-2 rounded-lg text-sm border border-black dark:border-gray-400"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
            }}
          />
          <input
            name="minStockAlert"
            type="number"
            value={form.minStockAlert}
            onChange={handleInput}
            placeholder="Min Alert"
            className="col-span-1 form-control px-3 py-2 rounded-lg text-sm border border-black dark:border-gray-400"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
            }}
          />

          <button
            type="submit"
            disabled={submitting}
            className="col-span-1 text-white btn btn--primary btn--sm flex items-center justify-center gap-2 bg-indigo-700 rounded-lg"
          >
            {submitting ? (
              <>
                <Loader className="animate-spin" size={16} />
                Adding...
              </>
            ) : (
              <>
                <Upload size={16} />
                Add Item
              </>
            )}
          </button>
        </form>
      </div>

      {editingProduct && (
        <ProdEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={handleUpdateProduct}
        />
      )}
    </div>
  );
}
