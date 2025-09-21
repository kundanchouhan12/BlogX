import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { Link } from "react-router-dom";
import { FaSearch, FaArrowRight, FaFeatherAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

// 👉 Named export (no default here)
export function HeroSlider({ posts }) {
  const [current, setCurrent] = useState(0);

  if (!posts || posts.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">No trending posts available</p>
      </div>
    );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % posts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [posts]);

  const post = posts[current];

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-xl shadow-lg">
      <img
        src={post.imageUrl || "https://via.placeholder.com/1200x500"}
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex flex-col justify-center h-full max-w-4xl mx-auto px-6 text-white">
        <span className="bg-indigo-600 px-4 py-1 rounded-full text-sm font-semibold w-fit mb-4">
          {post.username || "Anonymous"}
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-indigo-100 max-w-2xl line-clamp-3">
          {post.content}
        </p>
        <Link
          to={`/posts/${post.id}`}
          className="mt-6 inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Read Full Story <FaArrowRight />
        </Link>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {posts.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// 👉 Only Home is default
export default function Home() {
  const { posts } = usePosts();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [visiblePostsCount, setVisiblePostsCount] = useState(5);
  const postsToLoad = 5;

  let filteredPosts = posts.filter((p) =>
    [p.title, p.content, p.username].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const displayedPosts = filteredPosts.slice(0, visiblePostsCount);
  const loadMore = () => setVisiblePostsCount((prev) => prev + postsToLoad);

  const trendingPosts = posts.filter((p) => p.trending);
  const recentPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
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
            className="w-full p-4 border-2 rounded-full"
          />
        </div>

        <div className="grid gap-8">
          {displayedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl shadow-xl flex flex-col md:flex-row h-48 min-h-[12rem] overflow-hidden"
            >
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
            <button
              onClick={loadMore}
              className="px-6 py-3 rounded-full bg-indigo-600 text-white"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
