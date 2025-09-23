import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Comments({ postId }) {
  const { user, token, API_URL } = useAuth(); // ✅ API_URL from env
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/comments/post/${postId}`);
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [postId, API_URL]);

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/api/comments`,
        { postId, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err.response?.data || err.message);
      alert("Failed to add comment");
    }
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`${API_URL}/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      if (error.response?.status === 403) {
        alert("⚠️ You are not allowed to delete this comment");
      } else {
        alert("Something went wrong while deleting");
      }
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>

      <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={token ? "Add a comment..." : "Login to comment"}
          disabled={!token}
          className="flex-1 border rounded p-2"
        />
        <button
          type="submit"
          disabled={!token}
          className="bg-indigo-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Post
        </button>
      </form>

      {comments.map((comment) => (
        <div key={comment.id} className="comment-box mt-2 flex justify-between">
          <p>
            <b>{comment.username}</b>: {comment.content}
          </p>

          {comment.username === user?.name && (
            <button
              onClick={() => handleDelete(comment.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
