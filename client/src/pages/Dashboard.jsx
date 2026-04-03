import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.getProfile();
        setUser(data.user);
      } catch {
        // Token invalid/expired → hapus & redirect
        api.logout();
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    api.logout();
    toast.success("Berhasil logout 👋");
    navigate("/login", { replace: true });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Memuat dashboard...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🎉 Welcome Back!
        </h1>
        <p className="text-gray-600 mb-4">
          Logged in as: <strong className="text-blue-600">{user?.email}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Akun dibuat:{" "}
          {new Date(user?.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
