import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { Link } from "react-router-dom";
import { FaArrowRight, FaFeatherAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

function HeroSlider({ posts }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!posts || posts.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % posts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [posts]);

  if (!posts || posts.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">No trending posts available</p>
      </div>
    );
  }

  const post = posts[current];

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-xl shadow-2xl transition-all duration-700 ease-in-out">
      <img
        src={post.imageUrl || "https://via.placeholder.com/1200x500"}
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover scale-105 blur-sm"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

      <div className="relative z-10 flex flex-col justify-center h-full max-w-4xl mx-auto px-6 text-white">
        <span className="bg-indigo-600 px-4 py-1 rounded-full text-sm font-semibold w-fit mb-4 shadow-md">
          {post.username || post.user?.username || "Anonymous"}
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-xl">
          {post.title}
        </h1>

        <p className="mt-4 text-lg text-indigo-100 max-w-2xl line-clamp-3">
          {post.content}
        </p>

        <Link
          to={`/posts/${post.id}`}
          className="mt-6 inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 hover:bg-indigo-100 transition-transform"
        >
          Read Full Story <FaArrowRight />
        </Link>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {posts.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              i === current ? "bg-white scale-125" : "bg-gray-400 opacity-70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { posts } = usePosts();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [visiblePostsCount, setVisiblePostsCount] = useState(6);
  const postsToLoad = 6;

  let filteredPosts = posts.filter((p) =>
    [p.title, p.content, p.username].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const displayedPosts = filteredPosts.slice(0, visiblePostsCount);
  const loadMore = () => setVisiblePostsCount((prev) => prev + postsToLoad);

  const trendingPosts = posts.filter((p) => p.trending);
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);
  const suggestedPosts = [...posts].slice(0, 3);

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
            className="w-full p-4 border-2 border-indigo-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              <img
                src={post.imageUrl || "https://via.placeholder.com/400x200"}
                alt={post.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="text-lg font-bold text-indigo-800 hover:underline transition">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm line-clamp-3">
                    {post.content}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <FaFeatherAlt className="mr-2 text-indigo-500" />
                    <span>
                      By {post.username || post.user?.username || "Anonymous"}
                    </span>
                  </div>
                  <Link
                    to={`/posts/${post.id}`}
                    className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 text-sm"
                  >
                    Read More <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visiblePostsCount < filteredPosts.length && (
          <div className="flex justify-center mt-10">
            <button
              onClick={loadMore}
              className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
