// ...imports and HeroSlider remain the same

export default function Home() {
  const { user } = useAuth();
  const { posts, fetchPosts } = usePosts();
  const [showPopup, setShowPopup] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visiblePostsCount, setVisiblePostsCount] = useState(5);
  const postsToLoad = 5;
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setShowPopup(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((data) => {
        const sortedAuthors = data.sort(
          (a, b) => (b.postsCount || 0) - (a.postsCount || 0)
        );
        setAuthors(sortedAuthors);
      })
      .catch(console.error);
  }, []);

  const handleFilterChange = (type, value) => {
    if (type === "category") setActiveCategory(value);
    else if (type === "search") setSearch(value);
    setVisiblePostsCount(postsToLoad);
  };

  // Filter by category
  let filteredPosts = posts.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  // Search: bring matches to top
  if (search.trim() !== "") {
    const term = search.toLowerCase();
    const matched = [];
    const unmatched = [];
    filteredPosts.forEach((p) => {
      if (
        p.title.toLowerCase().includes(term) ||
        p.content.toLowerCase().includes(term)
      ) matched.push(p);
      else unmatched.push(p);
    });
    filteredPosts = [...matched, ...unmatched];
  }

  const displayedPosts = filteredPosts.slice(0, visiblePostsCount);
  const loadMore = () => setVisiblePostsCount((prev) => prev + postsToLoad);

  const trendingPosts = posts.filter((p) => p.trending);
  const recentPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  ).slice(0, 4);
  const suggestedPosts = [...posts].slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-12 flex flex-col">
      <HeroSlider posts={trendingPosts} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
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
              <div className="flex flex-wrap gap-3 mt-3 md:mt-0 md:w-1/3 justify-start md:justify-end">
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

            {/* Posts List */}
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
                  No posts found.
                </p>
              )}
            </div>

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

          {/* Sidebar (Authors + Recent + Suggested) */}
          <div className="space-y-10 hidden lg:block">
            {/* Top Authors */}
            <div className="backdrop-blur-xl bg-white/70 shadow-xl rounded-3xl p-6 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 hover:scrollbar-thumb-blue-600">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaUsers className="text-blue-500" /> Top Authors
              </h3>
              {authors.length > 0 ? (
                authors.map((a) => (
                  <div
                    key={a.id}
                    className="flex justify-between items-center p-2 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <span className="font-medium text-gray-800">{a.username}</span>
                    <span className="text-sm text-gray-500">{a.postsCount || 0} posts</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No authors found.</p>
              )}
            </div>

            {/* Latest Posts */}
            <div className="backdrop-blur-xl bg-white/70 shadow-xl rounded-3xl p-6 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-green-400 hover:scrollbar-thumb-green-600">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaClock className="text-green-500" /> Latest
              </h3>
              {recentPosts.map((p) => (
                <Link
                  key={p.id}
                  to={`/posts/${p.id}`}
                  className="block p-3 rounded-lg hover:bg-green-50 transition-all"
                >
                  <p className="text-gray-800 font-medium line-clamp-2">{p.title}</p>
                  <span className="text-xs text-gray-500">By {p.username}</span>
                </Link>
              ))}
            </div>

            {/* Suggested Posts */}
            <div className="backdrop-blur-xl bg-white/70 shadow-xl rounded-3xl p-6 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 hover:scrollbar-thumb-purple-600">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaLightbulb className="text-purple-500" /> Other
              </h3>
              {suggestedPosts.map((p) => (
                <Link
                  key={p.id}
                  to={`/posts/${p.id}`}
                  className="block p-3 rounded-lg hover:bg-purple-50 transition-all"
                >
                  <p className="text-gray-800 font-medium line-clamp-2">{p.title}</p>
                  <span className="text-xs text-gray-500">By {p.username}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showPopup && !user && <LoginPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}
