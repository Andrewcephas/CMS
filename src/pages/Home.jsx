import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center px-6">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Project Tracker</h1>
            <p className="text-lg text-gray-600 max-w-xl mb-8">
                A simple system to manage and track your IT project progress. Transparent, fast, and effective.
            </p>

            <div className="flex gap-4">
                <Link
                    to="/login"
                    className="bg-primary text-white px-6 py-3 rounded-2xl hover:bg-red-700 transition"
                >
                    Log In
                </Link>

                <a
                    href="#learn-more"
                    className="border border-blue-600 text-blue-600 px-6 py-3 rounded-2xl hover:bg-blue-50 transition"
                >
                    Learn More
                </a>
            </div>

            <section id="learn-more" className="mt-20 max-w-2xl text-left">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-6">
                    To simplify communication between IT companies and clients by offering real-time
                    progress tracking and project transparency.
                </p>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Vision</h2>
                <p className="text-gray-600">
                    Empower every IT client and provider to build trust and streamline their project
                    workflows through modern, easy-to-use software.
                </p>
            </section>
        </div>
    );
}

export default Home;
