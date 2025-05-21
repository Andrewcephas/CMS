import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState("client");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      setLoading(false);
      return;
    }

    // Simulate login/signup delay
    setTimeout(() => {
      redirectToDashboard(role);
      setLoading(false);
    }, 1000);
  };

  const redirectToDashboard = (role) => {
    if (role === "admin") navigate("/admin");
    else if (role === "company") navigate("/company");
    else if (role === "client") navigate("/client");
    else setError("Unknown role.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark text-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-dark">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        <form onSubmit={handleAuth}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded-xl"
          >
            <option value="client">Client</option>
            <option value="company">Company</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 border rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-600 mb-4 text-center font-semibold">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-xl hover:bg-red-700 transition"
          >
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-primary underline font-semibold"
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
