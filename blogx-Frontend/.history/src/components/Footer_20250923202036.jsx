import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically handle the subscription logic, e.g., send the email to your backend API
      console.log("Subscribing with email:", email);
      alert(`Thank you for subscribing, ${email}!`);
      setEmail(""); // Clear the input field
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center text-center md:text-left">
          {/* Main Footer Info */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-3xl font-extrabold text-white tracking-wide">
              BlogX
            </h3>
            <p className="mt-2 text-gray-400 max-w-sm">
              Explore stories, ideas, and knowledge on our platform. Subscribe
              to our newsletter for the latest updates.
            </p>
          </div>

          {/* Newsletter Subscription Form */}
          <div className="w-full md:w-auto">
            <h4 className="text-xl font-semibold mb-4 text-white">
              Stay in the Loop
            </h4>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full sm:w-80 px-4 py-3 rounded-full text-gray-900 bg-white border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-md"
              />
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors duration-300 shadow-lg"
              >
                Subscribe <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>

        {/* Separator */}
        <hr className="my-8 border-gray-700" />

        {/* Copyright and Social Links */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 sm:mb-0">
            © {new Date().getFullYear()} BlogX. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-400 transition-colors"
              aria-label="Twitter"
            >
              Twitter
            </a>
            <a
              href="https://github.com/kundanchouhan12"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-400 transition-colors"
              aria-label="GitHub"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/kundansinghchouhan"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-400 transition-colors"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}