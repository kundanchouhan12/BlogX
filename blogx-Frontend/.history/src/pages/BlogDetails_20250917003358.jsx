import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaTrash, FaPaperPlane } from "react-icons/fa";

export default function BlogDetails() {
  const { id } = useParams();
  const { token, user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/posts/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setPost(res.data);
      } catch (err) {
        console.error("fetchPost error:", err.response?.data || err.message);
        setError("Blog not found or access denied.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token]);

  const handleAddComment = async () => {
    if (!user) return alert("Login required to comment");
    if (!comment.trim()) return;

    setCommentLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:8080/api/posts/${id}/comments`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost((prev) => ({ ...prev, comments: [...(prev.comments || []), res.data] }));
      setComment("");
    } catch (err) {
      console.error("Add comment error:", err.response?.data || err.message);
      alert("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(
        `http://localhost:8080/api/posts/${id}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c.id !== commentId),
      }));
    } catch (err) {
      console.error("Delete comment error:", err.response?.data || err.message);
      alert("Failed to delete comment");
    }
  };

  if (loading) return <p className="text-center py-10">Loading post...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!post) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-600 mb-4">
        By <span className="font-semibold">{post.user?.name || "Unknown"}</span>
      </p>
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} className="w-full rounded-lg mb-4" />
      )}
      <p className="text-gray-800 whitespace-pre-line mb-6">{post.content}</p>

      {/* Comments */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Comments ({post.comments?.length || 0})</h2>

        {post.comments?.map((c) => (
          <div key={c.id} className="flex justify-between items-start bg-gray-50 p-3 rounded-lg shadow-sm mb-2">
            <div>
              <p className="font-medium">{c.user?.name || "Unknown"}</p>
              <p className="text-gray-700">{c.content}</p>
            </div>
            {user && c.user?.id === user.id && (
              <button
                onClick={() => handleDeleteComment(c.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            )}
          </div>
        ))}
        {(!post.comments || post.comments.length === 0) && (
          <p className="text-gray-500">No comments yet.</p>
        )}

        {/* Add Comment */}
        {user ? (
          <div className="flex gap-4 mt-4">
            <input
              type="text"
              className="flex-1 border-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-5 py-3 rounded-full"
              placeholder="Share your thoughts..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={handleAddComment}
              disabled={commentLoading}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
            >
              <FaPaperPlane />
              {commentLoading ? "Posting..." : "Post"}
            </button>
          </div>
        ) : (
          <p className="text-gray-500 mt-2">Login to post a comment.</p>
        )}
      </div>

      <Link to="/" className="mt-6 inline-block text-indigo-600 hover:text-indigo-800">
        ← Back to Home
      </Link>
    </div>
  );
}
