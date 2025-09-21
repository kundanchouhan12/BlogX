import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { Link } from "react-router-dom";
import { FaArrowRight, FaFeatherAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import HeroSlider from "./HeroSlider";

export default function Home() {
  const { posts } = usePosts();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const filteredPosts = posts.filter((p) =>
    [p.title, p.content, p.username].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const displayedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const handlePageClick = (page) => setCurrentPage(page);
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

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
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 items-center gap-2 flex-wrap">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              Previous
            </button>

            {[...Array(Math.min(5, totalPages)).keys()].map((i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageClick(pageNum)}
                  className={`px-4 py-2 rounded-full ${
                    currentPage === pageNum
                      ? "bg-indigo-700 text-white"
                      : "bg-white text-indigo-700 border border-indigo-300"
                  } hover:bg-indigo-100 transition`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
