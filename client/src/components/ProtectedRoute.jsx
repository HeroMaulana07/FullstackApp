import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  // Cek sync: kalau token nggak ada, langsung redirect
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
