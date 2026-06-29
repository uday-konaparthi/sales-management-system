import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Camera, ScanBarcode, ShoppingCart, Plus, X, Check, Trash2, Upload, Image as ImageIcon, CirclePlus, CircleMinus, ScanBarcodeIcon } from 'lucide-react';
import ProdsList from '@/components/prodsList';
import UploadBarCode from '@/utils/barcode/barcodeFIle';
import BarcodeInput from "../utils/barcode/barcodeScanner";
import { useReactToPrint } from "react-to-print";
import Invoice from "@/components/invoice/Invoice"

export default function SalesPage() {
  const { user } = useSelector(s => s.auth);
  const { showProdList } = useSelector(s => s.barCodeFetch);
  const dispatch = useDispatch()
  const invoiceRef = useRef();

  useEffect(() => {
    console.log(user)
  }, [user])

  /*const shop = {
    name: "Sai Krishna Shopping Mall",
    address: "S.P.T Market Road",
    city: "Munugode - 508244",
    gst: "36ABOFS4769H1ZH",
    phone: "9848343290",
    logo: ""
  };*/

  const [products, setProducts] = useState([]);
  const [selectingProduct, setSelectingProduct] = useState(false);
  const [scanBarcode, setScanBarcode] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [billItems, setBillItems] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [paymentType, setPaymentType] = useState("cash");
  const [saleInfo, setSaleInfo] = useState({
    billNo: "",
    cashier: "",
    counter: "",
    date: new Date()
  });

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: "Invoice"
  });

  // Fetch all products when user logs in
  useEffect(() => {
    async function fetchProducts() {
      try {
        const BASE_URL = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${BASE_URL}/api/products`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Could not load products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        toast.error(err.message);
      }
    }
    if (user) fetchProducts();
  }, [user]);

  const handleScan = (err, result) => {
    if (err) {
      console.error('Scanner error:', err);
      return;
    }

    if (result && result.text) {
      const code = result.text;
      setScanBarcode(code);
      console.log(`Scanned: ${code}`);
      toast.success(`Scanned: ${code}`);
      fetchProductsByBarcode(code);

      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  const fetchProductsByBarcode = (barcode) => {
    const matchedProducts = products.filter(p => p.barcode === barcode);
    if (matchedProducts.length === 0) {
      toast.error('Product not found for scanned barcode');
      return;
    }

    if (matchedProducts.length === 1) {
      addProductToBill(matchedProducts[0]);
    } else {
      setSameBarcodeProducts(matchedProducts);
      setSelectingProduct(true);
      setSellingPrice('');
      setQuantity(1);
    }
  };

  const addProductToBill = (product) => {
    const price = product.sellPrice || Number(sellingPrice);
    const qty = Number(quantity) || 1;

    if (!price || !qty) {
      toast.error('Enter valid selling price and quantity');
      return;
    }

    const existingIndex = billItems.findIndex(item => item.barcode === product.barcode && item.productId === product._id);
    if (existingIndex !== -1) {
      const updatedBill = [...billItems];
      updatedBill[existingIndex].quantity += qty;
      updatedBill[existingIndex].sellingPrice = price;
      updatedBill[existingIndex].profit = (price - product.costPrice) * updatedBill[existingIndex].quantity;
      setBillItems(updatedBill);
    } else {
      setBillItems([...billItems, {
        productId: product._id,
        barcode: product.barcode,
        name: product.name,
        costPrice: product.costPrice,
        sellingPrice: price,
        quantity: qty,
        profit: (price - product.costPrice) * qty
      }]);
    }
    setSelectingProduct(false);
    setScanBarcode('');
    setSellingPrice('');
    setQuantity(1);
    setUploadedImage(null);
  };

  const removeFromBill = (index) => {
    setBillItems(billItems.filter((_, i) => i !== index));
    toast.info('Item removed from bill');
  };

  const handleFinalizeSale = async () => {
    if (billItems.length === 0) return toast.error('No items to finalize');
    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BASE_URL}/api/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ products: billItems })
      });
      if (!res.ok) throw new Error('Sale failed');

      const data = await res.json();
      const sale = data.sale;

      console.log(sale);

      setSaleInfo({
        billNo: sale.invoiceNumber,
        cashier: user.name,
        counter: "Counter 1",
        billedItems: sale.products,
        totalAmount: sale.totalAmount,
        totalItems: sale.totalItems,
        paymentType: sale.paymentMethod,
        date: new Date()
      });

      setTimeout(() => {
        handlePrint();
      }, 300);

      toast.success('Sale recorded successfully!');
      setBillItems([]);

      setTimeout(() => {
        setBillItems([]);
      }, 1000);
    } catch (err) {
      console.log(err)
      toast.error(err.message);
    }
  };

  const totalAmount = billItems.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0);
  const totalProfit = billItems.reduce((acc, item) => acc + item.profit, 0);

  const incrementQty = (index) => {
    setBillItems(billItems.map((item, i) => i === index
      ? { ...item, quantity: item.quantity + 1 }
      : item));
  };

  const decrementQty = (index) => {
    setBillItems(billItems.map((item, i) => i === index && item.quantity > 1
      ? { ...item, quantity: item.quantity - 1 }
      : item));
  };

  const handleDetected = (code) => {
    console.log("✅ Detected barcode:", code);
  };

  const barcodeInputRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Enter") {
        if (document.activeElement !== barcodeInputRef.current) {
          e.preventDefault();
          barcodeInputRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="min-h-screen px-8 pt-8 pb-32 transition-colors"
      style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2
          className="text-3xl font-bold flex items-center gap-3"
          style={{
            color: 'var(--color-text)',
            letterSpacing: 'var(--letter-spacing-tight)'
          }}
        >
          <ShoppingCart size={28} style={{ color: 'var(--color-primary)' }} />
          Sales Terminal
        </h2>

        {showScanner ?
          (<div>
            <h1 className="text-xs font-bold dark:text-gray-400 px-5 mb-2 flex gap-3 items-center justify-between ">
              Upload Barcode Image
              <X className='size-5 text-red-400 hover:scale-120 cursor-pointer' onClick={() => setShowScanner(false)} />
            </h1>
            <div className="flex justify-center items-center gap-3 w-55">
              <UploadBarCode />
            </div>
            <div className="flex justify-center items-center gap-3 w-full">
              <BarcodeInput ref={barcodeInputRef} />
            </div>
          </div>)
          : (
            <div className='flex gap-2 flex-col items-center'>
              <button className='flex gap-3 items-center justify-center cursor-pointer px-6 py-1.5 bg-indigo-600 hover:bg-indigo-700 transition-colors text-lg font-semibold rounded text-white'
                onClick={() => setShowScanner(true)}>
                <ScanBarcodeIcon />
                Manual Scan
              </button>
              <div className="flex justify-center items-center gap-3 ">
                <BarcodeInput ref={barcodeInputRef} />
              </div>
            </div>
          )
        }


      </div>


      {/* Main layout */}
      <div className='border rounded-md mx-5'>
        <div className="rounded-lg p-6 sticky top-8"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-card-border)',
            boxShadow: 'var(--shadow-lg)'
          }}>
          <h3 className="text-xl font-semibold mb-4 pb-3"
            style={{
              color: 'var(--color-text)',
              borderBottom: '1px solid var(--color-border)'
            }}>
            Current Bill
          </h3>
          {billItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={48} className="mx-auto mb-3 opacity-30"
                style={{ color: 'var(--color-text-secondary)' }} />
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                No items in bill
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {billItems.map((item, idx) => (
                  <div key={idx}
                    className="p-3 rounded-lg flex justify-between items-center transition-colors"
                    style={{
                      backgroundColor: 'var(--color-secondary)',
                      border: '1px solid var(--color-border)'
                    }}>
                    <div className="flex-1">
                      <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
                        {item.name} {"{" + item.costPrice + "}"}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                        ₹ {item.costPrice} | ₹ {item.sellingPrice} × {item.quantity}
                      </p>
                    </div>

                    <div className='flex gap-2 px-3'>
                      <CircleMinus onClick={() => decrementQty(idx)} />
                      {item.quantity}
                      <CirclePlus onClick={() => incrementQty(idx)} />
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="font-semibold" style={{ color: 'var(--color-success)' }}>
                        ₹{(item.sellingPrice * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromBill(idx)}
                        className="p-1 rounded transition-all cursor-pointer"
                        style={{ color: 'var(--color-error)' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-secondary-hover)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <Trash2 size={16} className='text-red-400' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4"
                style={{ borderTop: '1px solid var(--color-border)' }}>
                <div className="flex justify-between items-center">
                  <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    Total Items:
                  </span>
                  <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    {billItems.length}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    Total Amount:
                  </span>
                  <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <label className="font-medium text-sm" htmlFor="paymentType">
                    Payment Type:
                  </label>
                  <select
                    id="paymentType"
                    className="bg-black rounded-lg px-3 py-2 font-semibold text-white outline-none transition-colors focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                    defaultValue="cash"
                    onChange={(e) => setPaymentType(e.target.value)}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>

              </div>
              <button
                onClick={handleFinalizeSale}
                className="w-full mt-6 flex items-center bg-orange-600 justify-center gap-2 py-3 rounded-lg font-semibold transition-all cursor-pointer hover:bg-orange-700"
              >
                <Check size={18} />
                Complete Sale
              </button>
            </>
          )}
        </div>
      </div>

      {/* Product Selection Modal */}
      {showProdList && (
        <ProdsList onSelect={(prod) => addProductToBill(prod)} />
      )}

      {/* CSS for scan animation */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
        }}>
        <Invoice
          ref={invoiceRef}
          sale={saleInfo}
        />
      </div>
    </div>
  );
}
