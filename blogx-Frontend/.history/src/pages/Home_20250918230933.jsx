import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { Link } from "react-router-dom";
import { FaSearch, FaArrowRight, FaFeatherAlt } from "react-icons/fa";

function HeroSlider({ posts }) {
  const [current, setCurrent] = useState(0);
  const total = posts?.length || 0;
  const intervalRef = useRef(null);

  useEffect(() => {
    if (total > 0) startAutoScroll();
    return () => stopAutoScroll();
  }, [current, total]);

  const startAutoScroll = () => {
    stopAutoScroll();
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
  };
  const stopAutoScroll = () => intervalRef.current && clearInterval(intervalRef.current);

  if (total === 0) return null;

  return (
    <div className="relative w-full h-[60vh] overflow-hidden group">
      {posts.map((p, i) => (
        <div
          key={p.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={p.imageUrl || "https://via.placeholder.com/800x400"}
            alt={p.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-800/70"></div>
          <div className="relative z-10 flex flex-col justify-center h-full max-w-4xl mx-auto px-6 text-white">
            <span className="bg-indigo-600 px-4 py-1 rounded-full text-sm font-semibold w-fit mb-4">
              {p.username}
            </span>
            <h1 className="text-5xl font-extrabold drop-shadow-lg">{p.title}</h1>
            <p className="mt-4 text-lg text-indigo-100 max-w-2xl">{p.content}</p>
            <Link
              to={`/posts/${p.id}`}
              className="mt-6 inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Read Full Story <FaArrowRight />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { posts } = usePosts();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [visiblePostsCount, setVisiblePostsCount] = useState(5);
  const postsToLoad = 5;

  // Filter posts based on search (title/content/author)
  let filteredPosts = posts.filter((p) =>
    [p.title, p.content, p.username].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const displayedPosts = filteredPosts.slice(0, visiblePostsCount);
  const loadMore = () => setVisiblePostsCount((prev) => prev + postsToLoad);

  const trendingPosts = posts.filter((p) => p.trending);
  const recentPosts = [...posts].sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt)).slice(0,4);
  const suggestedPosts = [...posts].slice(0,3);

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-12 flex flex-col">
      <HeroSlider posts={trendingPosts} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full mt-12">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 border-2 rounded-full"
          />
        </div>

        <div className="grid gap-8">
          {displayedPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-3xl shadow-xl flex flex-col md:flex-row h-48 min-h-[12rem] overflow-hidden">
              <img
                src={post.imageUrl || "https://via.placeholder.com/400x200"}
                alt={post.title}
                className="w-full md:w-1/3 h-48 object-cover"
              />
              <div className="p-3 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="text-xl font-bold">{post.title}</h2>
                  <p className="text-gray-600 line-clamp-3">{post.content}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center text-gray-500">
                    <FaFeatherAlt className="mr-1" />
                    <span className="text-sm">By {post.username}</span>
                  </div>
                  <Link to={`/posts/${post.id}`} className="text-indigo-600 font-medium">
                    Read More <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visiblePostsCount < filteredPosts.length && (
          <div className="flex justify-center mt-8">
            <button onClick={loadMore} className="px-6 py-3 rounded-full bg-indigo-600 text-white">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
