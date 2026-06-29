import React, { useState } from "react";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import fetchBarCodeVal from "../fetchBarCodeVal";

export default function UploadBarCode() {
  const [scanning, setScanning] = useState(false);
  const [decodedValue, setDecodedValue] = useState(null);
  const dispatch = useDispatch();

  // ⚙️ Configure ZXing for common barcodes
  const hints = new Map();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.EAN_13,
    BarcodeFormat.CODE_128,
    BarcodeFormat.UPC_A,
    BarcodeFormat.QR_CODE,
  ]);
  const codeReader = new BrowserMultiFormatReader(hints);

  // 📁 Decode from uploaded image
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanning(true);
    setDecodedValue(null);

    const imgUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = imgUrl;

    img.onload = async () => {
      try {
        const result = await codeReader.decodeFromImage(img);
        const text = result.getText();
        setDecodedValue(text);
        fetchBarCodeVal(text, dispatch);
      } catch (err) {
        console.error("Decode error:", err);
        toast.error("No barcode detected in uploaded image.");
      } finally {
        setScanning(false);
        e.target.value = null;
        URL.revokeObjectURL(imgUrl);
      }
    };
  };

  return (
    <div className="flex flex-col items-center gap-4 px-4">
      {/* 📁 File Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={scanning}
        className="border border-gray-300 rounded px-3 py-2 w-full max-w-sm text-gray-400"
      />

      {/* ✅ Decoded Result */}
      {decodedValue && (
        <p className=" text-green-600 font-semibold text-xs px-2">
          Decoded: {decodedValue}
        </p>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
