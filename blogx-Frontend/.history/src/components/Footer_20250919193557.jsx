import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="mt-16 bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-2">MyBlog</h3>
            <p className="text-sm text-indigo-100">
              Discover stories, share ideas, and connect with the world.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:underline">
                  Create Post
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:underline">
                  Signup
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Contact</h4>
            <p className="text-sm text-indigo-100">Email: support@myblog.com</p>
            <p className="text-sm text-indigo-100">Phone: +91 98765 43210</p>
          </div>
        </div>

        <div className="border-t border-indigo-500 text-center py-4 text-sm text-indigo-200">
          © {new Date().getFullYear()} MyBlog. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
