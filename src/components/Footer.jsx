function Footer() {
    return (
      <footer className="bg-dark text-white mt-auto py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} ProjectTracker. All rights reserved.
        </div>
      </footer>
    );
  }
  
  export default Footer;
  