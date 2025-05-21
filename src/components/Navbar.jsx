import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showBack, setShowBack] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setShowBack(location.pathname !== "/");
  }, [location.pathname]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-dark text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="bg-primary hover:bg-primary-dark p-2 rounded-full shadow-md transition duration-300"
              aria-label="Go Back"
              title="Go Back"
            >
              ←
            </button>
          )}

          <Link
            to="/"
            className="text-3xl font-extrabold text-primary tracking-wide hover:text-primary-dark transition duration-300"
          >
            ProjectTracker
          </Link>
        </div>

        {/* Marquee */}
        <div className="hidden md:block flex-1 mx-8 overflow-hidden relative h-7">
          <div className="absolute whitespace-nowrap animate-marquee font-semibold text-primary text-lg">
            Trust Us — Trust Us — Trust Us — Trust Us — Trust Us — Trust Us —
          </div>
        </div>

        {/* Nav Links & Profile */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex space-x-6 text-lg font-medium">
            <Link to="/" className={`hover:text-primary transition ${location.pathname === "/" ? "text-primary underline" : ""}`}>
              Home
            </Link>
            <Link to="/login" className={`hover:text-primary transition ${location.pathname === "/login" ? "text-primary underline" : ""}`}>
              Login
            </Link>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark px-3 py-1 rounded-full text-white transition"
            >
              <User size={20} />
              <ChevronDown size={18} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-dark shadow-lg rounded-lg overflow-hidden z-50">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                >
                  <User size={18} /> Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                >
                  <Settings size={18} /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Marquee Animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
        .bg-dark { background-color: #1f1f1f; }
        .text-primary { color: #ef4444; }
        .text-primary-dark { color: #b91c1c; }
        .bg-primary { background-color: #ef4444; }
        .bg-primary-dark { background-color: #b91c1c; }
      `}</style>
    </nav>
  );
}

export default Navbar;
