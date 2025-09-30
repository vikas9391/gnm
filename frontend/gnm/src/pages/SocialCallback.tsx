// src/pages/SocialCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const api = axios.create({ baseURL: API_BASE, withCredentials: true });

export default function SocialCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/auth/me/");
        if (res?.data) {
          navigate("/");
        } else {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
      }
    })();
  }, [navigate]);
  return <div>Processing login…</div>;
}
