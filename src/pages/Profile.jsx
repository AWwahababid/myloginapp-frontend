import { useEffect, useState } from "react";
import API from "../api/api.js";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/auth/profile");
        setUser(data);
      } catch (err) {
        alert("Please login again");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"));
    // Navigate after clearing storage
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8 flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8 flex items-center justify-center">
        <p className="text-white text-lg">No user data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="bg-slate-800 bg-opacity-60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700 border-opacity-50 shadow-2xl mb-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent mb-6">Your Profile</h2>
          
          <div className="space-y-4">
            <div className="bg-slate-700 bg-opacity-50 p-4 rounded-2xl border border-slate-600">
              <p className="text-slate-400 text-xs sm:text-sm">Name</p>
              <p className="text-white text-base sm:text-lg font-semibold">{user?.name || "N/A"}</p>
            </div>
            
            <div className="bg-slate-700 bg-opacity-50 p-4 rounded-2xl border border-slate-600">
              <p className="text-slate-400 text-xs sm:text-sm">Email</p>
              <p className="text-white text-base sm:text-lg font-semibold break-all">{user?.email || "N/A"}</p>
            </div>
            
            <div className="bg-slate-700 bg-opacity-50 p-4 rounded-2xl border border-slate-600">
              <p className="text-slate-400 text-xs sm:text-sm">Status</p>
              <p className="text-white text-base sm:text-lg font-semibold">{user?.isAdmin ? "Admin" : "User"}</p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/tasks")}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-pink-500/50 text-sm sm:text-base"
            >
              View Tasks
            </button>
            <button
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-2xl transition-all duration-300 text-sm sm:text-base"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
