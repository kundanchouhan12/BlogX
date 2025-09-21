import { useEffect, useState, useRef } from "react"; 
import { useAuth } from "../context/AuthContext";
import LoginPopup from "../components/LoginPopup";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaArrowRight,
  FaFeatherAlt,
  FaUsers,
  FaEnvelope,
  FaFire,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaLightbulb,
} from "react-icons/fa";
import axios from "axios";

// Hero Slider Component
function HeroSlider({ blogs }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = blogs.length;
  const sliderRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [currentSlide]);

  const startAutoScroll = () => {
    stopAutoScroll();
    scrollIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
  };

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
  };

  const nextSlide = () => {
    stopAutoScroll();
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    stopAutoScroll();
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  if (blogs.length === 0) return null;

  return (
    <div
      ref={sliderRef}
      className="relative w-full h-[60vh] overflow-hidden group"
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
    >
      {blogs.map((blog, index) => (
        <div
          key={blog.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={blog.imageUrl || "https://via.placeholder.com/800x400"}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-800/70"></div>
          <div className="relative z-10 flex flex-col justify-center h-full max-w-4xl mx-auto px-6 text-white">
            <span className="bg-indigo-600 px-4 py-1 rounded-full text-sm font-semibold w-fit mb-4">
              {blog.username}
            </span>
            <h1 className="text-5xl font-extrabold leading-tight drop-shadow-lg">
              {blog.title}
            </h1>
            <p className="mt-4 text-lg text-indigo-100 max-w-2xl">
              {blog.content}
            </p>
            <Link
              to={`/posts/${blog.id}`}
              className="mt-6 inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Read Full Story <FaArrowRight />
            </Link>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg z-20 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg z-20 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
      >
        <FaChevronRight />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {blogs.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              stopAutoScroll();
              setCurrentSlide(index);
            }}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentSlide ? "bg-white" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}

// Home Component
export default function Home() {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // "Load More" state
  const [visiblePostsCount, setVisiblePostsCount] = useState(5);
  const postsToLoad = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/posts");
        const data = Array.isArray(res.data) ? res.data : [];
        setBlogs(data);
        setAuthors([...new Set(data.map((b) => b.username))]);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setBlogs([]);
        setAuthors([]);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setShowPopup(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleFilterChange = (type, value) => {
    if (type === "category") {
      setActiveCategory(value);
    } else if (type === "search") {
      setSearch(value);
    }
    setVisiblePostsCount(postsToLoad);
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      (activeCategory === "All" || b.category === activeCategory) &&
      b.title.toLowerCase().includes(search.toLowerCase())
  );

  const displayedBlogs = filteredBlogs.slice(0, visiblePostsCount);
  const loadMore = () => setVisiblePostsCount((prev) => prev + postsToLoad);

  const trendingBlogs = blogs.filter((b) => b.trending);
  const recentBlogs = blogs.slice(-4).reverse();
  const suggestedBlogs = blogs.slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-12 flex flex-col">
      <HeroSlider blogs={trendingBlogs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Search & Category */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Search Bar */}
              <div className="relative w-full md:w-2/3">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full p-4 pl-12 pr-6 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                />
              </div>

              {/* Category Buttons */}
              <div className="flex flex-wrap md:flex-nowrap gap-3 mt-3 md:mt-0 md:w-1/3 justify-start md:justify-end">
                {["All", "Tech", "Travel", "Lifestyle", "Sports"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleFilterChange("category", cat)}
                    className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap ${
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
              {displayedBlogs.length > 0 ? (
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
                          <span className="text-sm">By {blog.username}</span>
                        </div>
                        <Link
                          to={`/posts/${blog.id}`}
                          className="inline-flex items-center gap-1 text-indigo-600 font-medium transition-colors hover:text-indigo-800"
                        >
                          Read More <FaArrowRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-lg py-10">
                  No blogs found for this selection.
                </p>
              )}
            </div>

            {/* "Load More" Button */}
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

          {/* Sidebar */}
          <div className="space-y-10 hidden lg:block">
            {/* Authors Section */}
            <div className="backdrop-blur-xl bg-white/70 shadow-xl rounded-3xl p-6 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-transparent hover:scrollbar-thumb-purple-500 transition-all">
              <h3 className="text-2xl font-bold mb-5 text-gray-800 flex items-center gap-2">
                <FaUsers className="text-indigo-600 text-xl" /> Authors
              </h3>
              <ul className="space-y-4">
                {authors.map((author) => (
                  <li key={author}>
                    <a
                      href="#"
                      className="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-gray-100"
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`}
                        alt={author}
                        className="w-12 h-12 rounded-full shadow-md"
                      />
                      <span className="text-lg font-medium text-gray-800">
                        {author}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* New Section */}
            <div className="backdrop-blur-xl bg-white/70 shadow-xl rounded-3xl p-6 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 hover:scrollbar-thumb-blue-600">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaEnvelope className="text-blue-500" /> New
              </h3>
              <div className="space-y-4">
                {blogs.slice(0, 5).map((b) => (
                  <Link
                    key={b.id}
                    to={`/posts/${b.id}`}
                    className="block p-3 rounded-lg hover:bg-blue-50 transition-all"
                  >
                    <p className="text-gray-800 font-medium line-clamp-2">{b.title}</p>
                    <span className="text-xs text-gray-500">By {b.username}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending Section */}
            <div className="backdrop-blur-xl bg-white/70 shadow-xl rounded-3xl p-6 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-red-400 hover:scrollbar-thumb-red-600">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaFire className="text-red-500" /> Trending
              </h3>
              <div className="space-y-4">
                {trendingBlogs.slice(0, 5).map((b) => (
                  <Link
                    key={b.id}
                    to={`/posts/${b.id}`}
                    className="block p-3 rounded-lg hover:bg-red-50 transition-all"
                  >
                    <p className="text-gray-800 font-medium line-clamp-2">{b.title}</p>
                    <span className="text-xs text-gray-500">By {b.username}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Latest Section */}
            <div className="backdrop-blur-xl bg-white/70 shadow-xl rounded-3xl p-6 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-green-400 hover:scrollbar-thumb-green-600">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaClock className="text-green-500" /> Latest
              </h3>
              <div className="space-y-4">
                {recentBlogs.map((b) => (
                  <Link
                    key={b.id}
                    to={`/posts/${b.id}`}
                    className="block p-3 rounded-lg hover:bg-green-50 transition-all"
                  >
                    <p className="text-gray-800 font-medium line-clamp-2">{b.title}</p>
                    <span className="text-xs text-gray-500">By {b.username}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Other Section */}
            <div className="backdrop-blur-xl bg-white/70 shadow-xl rounded-3xl p-6 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 hover:scrollbar-thumb-purple-600">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaLightbulb className="text-purple-500" /> Other
              </h3>
              <div className="space-y-4">
                {suggestedBlogs.map((b) => (
                  <Link
                    key={b.id}
                    to={`/posts/${b.id}`}
                    className="block p-3 rounded-lg hover:bg-purple-50 transition-all"
                  >
                    <p className="text-gray-800 font-medium line-clamp-2">{b.title}</p>
                    <span className="text-xs text-gray-500">By {b.username}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPopup && !user && <LoginPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}
