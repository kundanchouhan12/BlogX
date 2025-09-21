import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
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
  const { posts, fetchPosts } = usePosts(); // ✅ PostsContext
  const [showPopup, setShowPopup] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // "Load More" state
  const [visiblePostsCount, setVisiblePostsCount] = useState(5);
  const postsToLoad = 5;

  useEffect(() => {
    fetchPosts(); // fetch posts from context on mount
  }, []);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setShowPopup(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleFilterChange = (type, value) => {
    if (type === "category") setActiveCategory(value);
    else if (type === "search") setSearch(value);
    setVisiblePostsCount(postsToLoad);
  };

  const filteredPosts = posts.filter(
    (p) =>
      (activeCategory === "All" || p.category === activeCategory) &&
      p.title.toLowerCase().includes(search.toLowerCase())
  );

  const displayedPosts = filteredPosts.slice(0, visiblePostsCount);
  const loadMore = () => setVisiblePostsCount((prev) => prev + postsToLoad);

  const trendingPosts = posts.filter((p) => p.trending);
  const recentPosts = [...posts].slice(-4).reverse();
  const suggestedPosts = posts.slice(0, 3);
  const authors = [...new Set(posts.map((p) => p.username))];

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-12 flex flex-col">
      <HeroSlider blogs={trendingPosts} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Search & Category */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
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
              {displayedPosts.length > 0 ? (
                displayedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row h-48 min-h-[12rem]"
                  >
                    <img
                      src={post.imageUrl || "https://via.placeholder.com/400x200"}
                      alt={post.title}
                      className="w-full md:w-1/3 h-48 object-cover"
                    />
                    <div className="p-3 flex flex-col justify-between flex-grow">
                      <div>
                        <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                          {post.category || "General"}
                        </span>
                        <h2 className="text-xl font-bold text-gray-900 mt-1 line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 mt-1 font-serif line-clamp-3">
                          {post.content}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center text-gray-500">
                          <FaFeatherAlt className="mr-1" />
                          <span className="text-sm">By {post.username}</span>
                        </div>
                        <Link
                          to={`/posts/${post.id}`}
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
                  No posts found for this selection.
                </p>
              )}
            </div>

            {/* "Load More" Button */}
            {visiblePostsCount < filteredPosts.length && (
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
            {/* Authors, New, Trending, Latest, Other sections same as before */}
          </div>
        </div>
      </div>

      {showPopup && !user && <LoginPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}
