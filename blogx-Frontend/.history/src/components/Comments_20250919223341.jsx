import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Comments({ postId }) {
  const { user, token, showPopup, setShowPopup } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // ✅ Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/comments/post/${postId}`
        );
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [postId]);

  // ✅ Delete comment
  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // delete hone ke baad UI update karo
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

  // ✅ Add comment
  const handleAddComment = async () => {
  if (!commentText.trim()) return;

  try {
    const res = await axios.post(
      `http://localhost:8080/api/comments`,
      {
        postId: post.id,   // backend isko lega
        content: commentText
        // userId mat bhej → backend nikaalega logged-in user se
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
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


  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      <ul className="mb-4">
        {comments.map((c) => (
          <li key={c.id} className="border-b py-2">
            <strong>{c.username}:</strong> {c.content}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="flex gap-2">
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

      {/* ✅ comment list with delete option */}
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
