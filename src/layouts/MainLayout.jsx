import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
// This layout component wraps around the main content of the application.
// It includes a navigation bar at the top, a footer at the bottom, and a main content area in between.