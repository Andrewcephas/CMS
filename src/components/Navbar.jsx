import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showBack, setShowBack] = useState(false);

  // Show back button only if not on home page
  useEffect(() => {
    setShowBack(location.pathname !== "/");
  }, [location.pathname]);

  return (
    <nav className="bg-dark text-white shadow-md relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="bg-primary hover:bg-red-700 p-2 rounded-full transition"
              aria-label="Go Back"
            >
              ←
            </button>
          )}

          <Link to="/" className="text-2xl font-bold text-primary">
            ProjectTracker
          </Link>
        </div>

        {/* Marquee Container */}
        <div className="hidden md:block flex-1 mx-6 overflow-hidden relative h-6">
          <div className="absolute whitespace-nowrap animate-marquee text-primary font-semibold text-lg">
            Trust Us — Trust Us — Trust Us — Trust Us — Trust Us — Trust Us — Trust Us —
          </div>
        </div>

        <div className="space-x-6 hidden md:flex">
          <Link to="/" className="hover:text-primary transition">
            Home
          </Link>
          <Link to="/login" className="hover:text-primary transition">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
