import { useParams } from "react-router-dom";
import blogs from "../data/blogsData";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";
import { FaPaperPlane } from 'react-icons/fa'; // Added for the icon

export default function BlogDetails() {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === parseInt(id));

  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleAdd = () => {
    if (!user) {
      setShowModal(true);
      return;
    }
    if (!comment.trim()) return;
    setComments([...comments, { text: comment, user: user.name }]);
    setComment("");
  };

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-2xl font-semibold text-gray-600">
          Oops! The blog you are looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative">
          <img
            src={blog.img}
            alt={blog.title}
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>

        <div className="p-8">
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
            <span>By <span className="font-medium text-gray-700">{blog.author}</span></span>
            <span className="text-gray-400">•</span>
            <span>{blog.category}</span>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {blog.title}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 font-serif">
            {blog.content}
          </p>

          <hr className="border-t-2 border-gray-200 my-8" />

          {/* Comments Section */}
          <div className="bg-gray-100 p-6 rounded-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-5">
              Comments ({comments.length})
            </h3>
            <div className="space-y-4 mb-6">
              {comments.length === 0 ? (
                <p className="text-gray-500">No comments yet. Be the first to post!</p>
              ) : (
                comments.map((c, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <p className="text-gray-800 mb-1">{c.text}</p>
                    <span className="text-sm font-medium text-indigo-600">
                      — {c.user}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <div className="flex gap-4">
              <input
                type="text"
                className="flex-1 border-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-5 py-3 rounded-full transition-all duration-200"
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={handleAdd}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <FaPaperPlane className="text-sm" />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </div>
  );
}