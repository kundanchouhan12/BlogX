import { useState } from "react";
import { Link } from "react-router-dom";
import { usePosts } from "../context/PostsContext";
import { FaArrowRight, FaFeatherAlt, FaSearch } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { posts, loading } = usePosts();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visiblePostsCount, setVisiblePostsCount] = useState(5);

  const filteredBlogs = posts.filter(
    (b) =>
      (activeCategory === "All" || b.category === activeCategory) &&
      b.title.toLowerCase().includes(search.toLowerCase())
  );

  const displayedBlogs = filteredBlogs.slice(0, visiblePostsCount);

  const loadMore = () => setVisiblePostsCount((prev) => prev + 5);

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-12 flex flex-col">
      {/* Search + Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row gap-5 items-center mb-6">
          <div className="relative w-full">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 pl-12 pr-6 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto py-2">
            {["All", "Tech", "Travel", "Lifestyle", "Sports"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog List */}
        <div className="grid gap-8">
          {loading ? (
            <p className="text-center text-gray-500 text-lg py-10">Loading posts...</p>
          ) : displayedBlogs.length > 0 ? (
            displayedBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row h-48 min-h-[12rem]"
              >
                <img
                  src={blog.imageUrl || "https://via.placeholder.com/400x200"}
                  alt={blog.title}
                  className="w-full md:w-1/3 h-48 object-cover"
                />
                <div className="p-3 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                      {blog.category || "General"}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 mt-1 line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 mt-1 font-serif line-clamp-3">
                      {blog.content}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center text-gray-500">
                      <FaFeatherAlt className="mr-1" />
                      <span className="text-sm">By {blog.user.name}</span>
                    </div>
                    <Link
                      to={`/posts/${blog.id}`}
                      className="inline-flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-800"
                    >
                      Read More <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg py-10">No blogs found.</p>
          )}
        </div>

        {visiblePostsCount < filteredBlogs.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="px-6 py-3 rounded-full text-white font-bold bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:scale-105 transition-transform"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
