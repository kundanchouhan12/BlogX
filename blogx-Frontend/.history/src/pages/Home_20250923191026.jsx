import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowRight, FaFeatherAlt, FaSearch } from "react-icons/fa";
import Footer from "../components/Footer";

export default function Home() {
  const { posts, fetchPosts } = usePosts();
  const { user, API_URL, token } = useAuth();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const postsPerPage = 6;

  // Fetch posts every 30s
  useEffect(() => {
    const interval = setInterval(() => fetchPosts(), 30000);
    return () => clearInterval(interval);
  }, [fetchPosts]);

  // Fetch Most Active Users
  const fetchMostActiveUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/most-active`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setMostActiveUsers(res.data || []);
    } catch (err) {
      console.error("fetchMostActiveUsers error:", err.response?.data || err.message);
      setMostActiveUsers([]);
    }
  };

  useEffect(() => {
    fetchMostActiveUsers();
  }, []);

  // Filter posts by search
  const filteredPosts = posts.filter((p) =>
    [p.title, p.content, p.username]
      .some((field) => field?.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const displayedPosts = [...filteredPosts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(startIndex, startIndex + postsPerPage);

  const handlePageClick = (page) => setCurrentPage(page);
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Latest posts slider
  const sliderPosts = [...posts]
    .filter((p) => p.imageUrl)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Highly Interested: top 5 posts with most comments
  const highlyInterestedPosts = [...posts]
    .sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0))
    .slice(0, 5);

  // --- Components ---
  function HeroSlider({ posts }) {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
      if (!posts.length) return;
      const interval = setInterval(() => setCurrent((prev) => (prev + 1) % posts.length), 5000);
      return () => clearInterval(interval);
    }, [posts]);

    if (!posts.length)
      return (
        <div className="h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center bg-gray-100">
          <p className="text-gray-500 text-lg">No posts available</p>
        </div>
      );

    const post = posts[current];
    return (
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-xl shadow-2xl transition-all duration-700 ease-in-out mb-12">
        <img src={post.imageUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover scale-105 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center h-full max-w-4xl mx-auto px-4 sm:px-6 text-white text-center sm:text-left">
          <span className="bg-indigo-600 px-4 py-1 rounded-full text-sm font-semibold w-fit mb-4 shadow-md mx-auto sm:mx-0">
            {post.username || user?.name || "Anonymous"}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-xl">{post.title}</h1>
          <p className="mt-4 text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto sm:mx-0 line-clamp-3">{post.content}</p>
          <Link to={`/posts/${post.id}`} className="mt-6 inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 hover:bg-indigo-100 transition-transform mx-auto sm:mx-0">
            Read Full Story <FaArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  function PostsGrid({ title, posts }) {
    return (
      <div className="my-12">
        <h2 className="text-2xl font-bold text-indigo-800 mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
              <img src={post.imageUrl || "https://via.placeholder.com/400x200"} alt={post.title} className="w-full h-40 sm:h-48 md:h-56 object-cover" />
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-bold text-indigo-800 hover:underline transition line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mt-2 text-sm line-clamp-3">{post.content}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <FaFeatherAlt className="mr-2 text-indigo-500" />
                    <span>By {post.username || user?.name || "Anonymous"}</span>
                  </div>
                  <Link to={`/posts/${post.id}`} className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 text-sm">
                    Read More <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function ActiveUsersGrid({ users }) {
    if (!users.length) return null;
    return (
      <div className="my-12">
        <h2 className="text-2xl font-bold text-indigo-800 mb-6">Most Active Users</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {users.map((u) => (
            <div key={u.id} className="bg-white rounded-xl shadow-md flex flex-col items-center p-4">
              <img src={u.avatarUrl || "https://via.placeholder.com/80"} alt={u.name} className="w-20 h-20 rounded-full object-cover mb-2" />
              <h3 className="font-semibold text-indigo-700 text-sm text-center">{u.name}</h3>
              <p className="text-gray-500 text-xs">{u.postsCount || 0} posts</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <main className="flex-grow pb-12">
        <HeroSlider posts={sliderPosts} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12">
          {/* Search Bar */}
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-4 pl-12 border-2 border-indigo-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500" />
            </div>
          </div>

          {/* Highly Interested Posts */}
          <PostsGrid title="Highly Interested Posts" posts={highlyInterestedPosts} />

          {/* All Posts */}
          <PostsGrid title="All Posts" posts={displayedPosts} />

          {/* Most Active Users */}
          <ActiveUsersGrid users={mostActiveUsers} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 items-center gap-2 flex-wrap">
              <button onClick={handlePrev} disabled={currentPage === 1} className="px-4 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50">
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageClick(i + 1)}
                  className={`px-4 py-2 rounded-full ${
                    currentPage === i + 1 ? "bg-indigo-700 text-white" : "bg-white text-indigo-700 border border-indigo-300"
                  } hover:bg-indigo-100 transition`}
                >
                  {i + 1}
                </button>
              ))}

              <button onClick={handleNext} disabled={currentPage === totalPages} className="px-4 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50">
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
