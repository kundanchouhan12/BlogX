import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import axios from "axios";
import Comments from "./Comments";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const commentsRef = useRef(null);

  // Fetch Blogs
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/blogs")
      .then((res) => {
        setBlogs(res.data);
        setFilteredBlogs(res.data);
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  // Search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBlogs(filtered);
      setCurrentPage(1);
    }
  }, [searchQuery, blogs]);

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full md:w-2/3 lg:w-1/2">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Blog List */}
      {currentBlogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentBlogs.map((blog) => (
            <div
              key={blog.id}
              className="p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all flex flex-col"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {blog.title}
              </h2>
              <p className="text-gray-600 flex-grow">{blog.excerpt}</p>
              <Link
                to={`/blogs/${blog.id}`}
                className="mt-4 inline-block text-blue-600 font-medium hover:underline"
              >
                Read More →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredBlogs.length > blogsPerPage && (
        <div className="flex justify-center items-center gap-4 mb-10">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Comments Section (Scrollable, Stylish, Under Search) */}
      <div
        ref={commentsRef}
        className="max-h-[400px] overflow-y-auto p-4 bg-gray-50 rounded-2xl shadow-inner scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200"
      >
        <Comments postId={1} />
      </div>
    </div>
  );
}
