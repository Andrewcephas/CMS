import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState("client");
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      setLoading(false);
      return;
    }

    // Simulate delay
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

  const renderRoleSpecificFields = () => {
    if (!isSignup) return null;

    switch (role) {
      case "client":
        return (
          <>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full mb-3 px-4 py-2 border rounded-xl"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full mb-3 px-4 py-2 border rounded-xl"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="project"
              placeholder="Project or Company Name"
              className="w-full mb-3 px-4 py-2 border rounded-xl"
              onChange={handleInputChange}
            />
          </>
        );

      case "company":
        return (
          <>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              className="w-full mb-3 px-4 py-2 border rounded-xl"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="contactPerson"
              placeholder="Contact Person"
              className="w-full mb-3 px-4 py-2 border rounded-xl"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full mb-3 px-4 py-2 border rounded-xl"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="website"
              placeholder="Company Website"
              className="w-full mb-3 px-4 py-2 border rounded-xl"
              onChange={handleInputChange}
            />
          </>
        );

      case "admin":
        return (
          <>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full mb-3 px-4 py-2 border rounded-xl"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="adminCode"
              placeholder="Admin Code"
              className="w-full mb-3 px-4 py-2 border rounded-xl"
              onChange={handleInputChange}
            />
          </>
        );

      default:
        return null;
    }
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
            name="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 border rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {renderRoleSpecificFields()}

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
