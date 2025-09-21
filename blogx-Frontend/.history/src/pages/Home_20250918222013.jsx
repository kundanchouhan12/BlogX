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

// Hero Slider
function HeroSlider({ posts }) {
  const [current, setCurrent] = useState(0);
  const total = posts.length;
  const intervalRef = useRef(null);

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [current, total]);

  const startAutoScroll = () => {
    stopAutoScroll();
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
    }, 5000);
  };

  const stopAutoScroll = () => intervalRef.current && clearInterval(intervalRef.current);

  const prevSlide = () => setCurrent(prev => (prev - 1 + total) % total);
  const nextSlide = () => setCurrent(prev => (prev + 1) % total);

  if (!total) return null;

  return (
    <div className="relative w-full h-[60vh] overflow-hidden group">
      {posts.map((p, i) => (
        <div
          key={p.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img src={p.imageUrl || "https://via.placeholder.com/800x400"} alt={p.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-800/70"></div>
          <div className="relative z-10 flex flex-col justify-center h-full max-w-4xl mx-auto px-6 text-white">
            <span className="bg-indigo-600 px-4 py-1 rounded-full text-sm font-semibold w-fit mb-4">{p.username}</span>
            <h1 className="text-5xl font-extrabold drop-shadow-lg">{p.title}</h1>
            <p className="mt-4 text-lg text-indigo-100 max-w-2xl">{p.content}</p>
            <Link to={`/posts/${p.id}`} className="mt-6 inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform">
              Read Full Story <FaArrowRight />
            </Link>
          </div>
        </div>
      ))}

      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110"><FaChevronLeft /></button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110"><FaChevronRight /></button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {posts.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full ${i===current?"bg-white":"bg-gray-400"}`}></button>
        ))}
      </div>
    </div>
  );
}

// Home Component
export default function Home() {
  const { user } = useAuth();
  const { posts, fetchPosts } = usePosts();
  const [showPopup, setShowPopup] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(5);

  const postsToLoad = 5;

  useEffect(() => { fetchPosts(); }, []);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setShowPopup(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleFilter = (type, value) => {
    if (type==="category") setActiveCategory(value);
    else if (type==="search") setSearch(value);
    setVisibleCount(postsToLoad);
  };

  const filtered = posts.filter(p => (activeCategory==="All" || p.category===activeCategory) && p.title.toLowerCase().includes(search.toLowerCase()));
  const displayed = filtered.slice(0, visibleCount);
  const loadMore = () => setVisibleCount(prev => prev + postsToLoad);

  const trending = posts.filter(p => p.trending);
  const recent = [...posts].slice(-4).reverse();
  const suggested = posts.slice(0,3);
  const authors = [...new Set(posts.map(p=>p.username))];

  return (
    <div className="bg-gray-50 min-h-screen pb-12 flex flex-col">
      <HeroSlider posts={trending} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Posts */}
          <div className="lg:col-span-2 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative w-full md:w-2/3">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="text" placeholder="Search posts..." value={search} onChange={e=>handleFilter("search", e.target.value)}
                  className="w-full p-4 pl-12 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div className="flex flex-wrap md:flex-nowrap gap-3 mt-3 md:mt-0 md:w-1/3 justify-start md:justify-end">
                {["All","Tech","Travel","Lifestyle","Sports"].map(c => (
                  <button key={c} onClick={()=>handleFilter("category", c)}
                    className={`px-5 py-2 rounded-full text-sm font-medium ${activeCategory===c?"bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg":"bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-8">
              {displayed.length ? displayed.map(post=>(
                <div key={post.id} className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row h-48 min-h-[12rem]">
                  <img src={post.imageUrl || "https://via.placeholder.com/400x200"} alt={post.title} className="w-full md:w-1/3 h-48 object-cover"/>
                  <div className="p-3 flex flex-col justify-between flex-grow">
                    <div>
                      <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">{post.category||"General"}</span>
                      <h2 className="text-xl font-bold mt-1 line-clamp-2">{post.title}</h2>
                      <p className="text-gray-600 mt-1 font-serif line-clamp-3">{post.content}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center text-gray-500"><FaFeatherAlt className="mr-1"/>{post.username}</div>
                      <Link to={`/posts/${post.id}`} className="text-indigo-600 font-medium">Read More</Link>
                    </div>
                  </div>
                </div>
              )): <p className="text-center text-gray-500 py-10">No posts found.</p>}
            </div>

            {visibleCount < filtered.length && (
              <div className="flex justify-center mt-8">
                <button onClick={loadMore} className="px-6 py-3 bg-indigo-600 text-white rounded-full">Load More</button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-10 hidden lg:block">
            {/* Authors */}
            <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-4">Authors</h3>
              {authors.map(a=><p key={a} className="text-gray-700">{a}</p>)}
            </div>
            {/* Suggested */}
            <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-4">Suggested</h3>
              {suggested.map(p=><Link key={p.id} to={`/posts/${p.id}`} className="block text-indigo-600 hover:underline">{p.title}</Link>)}
            </div>
            {/* Recent */}
            <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-4">Recent</h3>
              {recent.map(p=><Link key={p.id} to={`/posts/${p.id}`} className="block text-gray-700 hover:text-indigo-600">{p.title}</Link>)}
            </div>
          </div>
        </div>
      </div>

      {showPopup && !user && <LoginPopup onClose={()=>setShowPopup(false)} />}
    </div>
  );
}
