import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api.js";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", { name, email, password });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden p-4">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500 opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-pink-500 opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"></div>

      <form onSubmit={handleSignup} className="relative bg-slate-800 bg-opacity-60 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-slate-700 border-opacity-50 shadow-2xl w-full sm:w-96 hover:scale-105 transition-transform duration-500">
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">Join us and unlock amazing features</p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-700 bg-opacity-50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 text-sm sm:text-base"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-700 bg-opacity-50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-700 bg-opacity-50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 text-sm sm:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M15.171 13.576l1.473 1.473A10.014 10.014 0 0019.542 10c-1.274-4.057-5.064-7-9.542-7a9.958 9.958 0 00-4.512 1.074l1.473 1.473C9.773 3.645 9.88 3.645 10 3.645a4 4 0 014 4v.17l1.171 1.171z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 sm:py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-pink-500/50 text-sm sm:text-base">
          Create Account
        </button>

        <p className="mt-4 sm:mt-6 text-center text-slate-400 text-xs sm:text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 font-semibold hover:text-purple-300 transition">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;

