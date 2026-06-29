import { setFetchedProds, setShowProdList } from "@/store/barCodeFetchSlice";

export default async function fetchBarCodeVal(barCodeValue, dispatch) {

  // Fetch function (outside component)
  try {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const response = await fetch(`${BASE_URL}/api/products/barcode/${barCodeValue}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const data = await response.json();
    console.log(data);

    dispatch(setFetchedProds(data));
    dispatch(setShowProdList());

  } catch (error) {
    console.error(error.message);
  }
}


