import React, { forwardRef } from "react";
import { useDispatch } from "react-redux";
import fetchBarCodeVal from "../fetchBarCodeVal";

const BarcodeInput = forwardRef((props, ref) => {
  const dispatch = useDispatch();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const barcode = ref.current.value.trim();

      if (!barcode) return;

      fetchBarCodeVal(barcode, dispatch);
      ref.current.value = "";
    }
  };

  return (
    <input
      ref={ref}
      type="text"
      placeholder="Scan barcode here"
      onKeyDown={handleKeyDown}
      className="h-10 px-0.5 border-none rounded placeholder:px-5"
    />
  );
});

export default BarcodeInput;