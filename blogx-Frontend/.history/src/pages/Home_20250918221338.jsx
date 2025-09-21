import { useEffect, useState } from "react";
import { usePosts } from "../context/PostsContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import LoginPopup from "../components/LoginPopup";

export default function Home() {
  const { user } = useAuth();
  const { posts, fetchPosts } = usePosts();
  const [showPopup, setShowPopup] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [visiblePostsCount, setVisiblePostsCount] = useState(5);
  const postsToLoad = 5;

  useEffect(() => {
    fetchPosts(); // load posts on mount
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
    p => (activeCategory==="All" || p.category===activeCategory) &&
         p.title.toLowerCase().includes(search.toLowerCase())
  );
  const displayedPosts = filteredPosts.slice(0, visiblePostsCount);

  const loadMore = () => setVisiblePostsCount(prev => prev + postsToLoad);

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      {/* Search & Category */}
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e=>handleFilterChange("search", e.target.value)}
          className="border px-4 py-2 rounded w-2/3"
        />
        <select value={activeCategory} onChange={e=>handleFilterChange("category", e.target.value)} className="border px-4 py-2 rounded">
          {["All","Tech","Travel","Lifestyle","Sports","General"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Posts */}
      {displayedPosts.map(post=>(
        <div key={post.id} className="bg-white p-6 rounded-xl shadow-md">
          <img src={post.imageUrl || "https://via.placeholder.com/400x200"} alt={post.title} className="w-full h-48 object-cover rounded mb-3"/>
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p>{post.content}</p>
          <p className="text-sm text-gray-500 mt-1">By {post.username} | Category: {post.category || "General"}</p>
          <Link to={`/posts/${post.id}`} className="text-indigo-600 hover:underline mt-2 inline-block">Read More</Link>
        </div>
      ))}

      {visiblePostsCount < filteredPosts.length && (
        <button onClick={loadMore} className="px-6 py-2 bg-indigo-600 text-white rounded-full">Load More</button>
      )}

      {showPopup && !user && <LoginPopup onClose={()=>setShowPopup(false)} />}
    </div>
  );
}
