// src/hooks/useLogout.js
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/authSlice";

export default function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(logout());
        navigate("/login");
      } else {
        console.error("Logout failed:", data?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return handleLogout;
}
