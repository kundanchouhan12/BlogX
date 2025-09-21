import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  // ✨ For editing comments
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  // ✅ Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // ✅ Add comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:8080/api/posts/${id}/comments`,
        { content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), res.data],
      }));
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err.response?.data || err.message);
      alert("Failed to add comment");
    }
  };

  // ✅ Delete comment
  const handleDeleteComment = async (commentId) => {
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

  // ✅ Edit comment
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const res = await axios.put(
        `http://localhost:8080/api/posts/${id}/comments/${commentId}`,
        { content: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c.id === commentId ? { ...c, content: res.data.content } : c
        ),
      }));

      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      console.error("Update comment error:", err.response?.data || err.message);
      alert("Failed to update comment");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!post) return <p className="text-center mt-10">Post not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Post Content */}
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-6">{post.content}</p>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full rounded-lg mb-6"
        />
      )}
      <p className="text-sm text-gray-500 mb-6">
        Author: <span className="font-semibold">{post.username}</span>
      </p>

      {/* Comments Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>

        {/* List of comments */}
        {post.comments?.length > 0 ? (
          post.comments.map((c) => (
            <div
              key={c.id}
              className="flex justify-between items-start bg-gray-50 p-3 rounded-lg shadow-sm mb-2"
            >
              <div className="flex-1">
                <p className="font-medium">{c.user?.name || "Unknown"}</p>

                {editingCommentId === c.id ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      className="flex-1 border px-2 py-1 rounded"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button
                      onClick={() => handleUpdateComment(c.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-700">{c.content}</p>
                )}
              </div>

              {/* Only show edit/delete for author */}
              {user && c.user?.id === user.id && (
                <div className="flex gap-2 ml-3">
                  <button
                    onClick={() => handleEditComment(c)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet</p>
        )}

        {/* Add comment input */}
        {user ? (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 border px-3 py-2 rounded-lg"
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Post
            </button>
          </div>
        ) : (
          <p className="text-gray-600 mt-4">Login to add comments</p>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
