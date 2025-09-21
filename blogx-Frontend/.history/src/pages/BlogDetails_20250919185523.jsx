import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function BlogDetails() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();

  // ✅ Post fetch
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/posts/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };
    fetchPost();
  }, [id, token]);

  // ✅ Comments fetch
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/posts/${id}/comments`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    if (id) fetchComments();
  }, [id, token]);

  // ✅ Add Comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await axios.post(
        `http://localhost:8080/api/comments`,
        { postId: id, content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // refresh comments
      const res = await axios.get(
        `http://localhost:8080/api/posts/${id}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data);

      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err.response?.data || err.message);
      alert("Failed to add comment");
    }
  };

  // ✅ Delete Comment
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment");
    }
  };

  // ✅ Update Comment
  const handleUpdateComment = async (commentId, oldContent) => {
    const newContent = prompt("Update your comment:", oldContent);
    if (!newContent || newContent.trim() === "") return;

    try {
      const res = await axios.put(
        `http://localhost:8080/api/comments/${commentId}`,
        { content: newContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? res.data : c))
      );
    } catch (err) {
      console.error("Error updating comment:", err);
      alert("Failed to update comment");
    }
  };

  if (!post) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <img
        src={post.imageUrl || "https://via.placeholder.com/800x400"}
        alt={post.title}
        className="w-full rounded-lg mb-4"
      />
      <p className="text-gray-700">{post.content}</p>
      <p className="text-sm text-gray-500 mt-2">
        By <span className="font-semibold">{post.username}</span>
      </p>

      {/* ✅ Comments Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-3">Comments</h2>

        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet</p>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => (
              <li
                key={c.id}
                className="p-3 bg-gray-100 rounded-lg flex justify-between"
              >
                <div>
                  <p className="text-sm text-gray-800">{c.content}</p>
                  <p className="text-xs text-gray-500">— {c.username}</p>
                </div>

                {/* ✅ Update/Delete only apne comment ke liye */}
                {user?.name === c.username && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateComment(c.id, c.content)}
                      className="text-blue-600 text-xs"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* ✅ Add Comment */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-grow border p-2 rounded-lg"
          />
          <button
            onClick={handleAddComment}
            className="bg-indigo-600 text-white px-4 rounded-lg"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
