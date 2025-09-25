import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Comments({ postId }) {
  const { user, token, API_URL } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null); // ✅ kis comment ko reply karna hai
  const [replyContent, setReplyContent] = useState("");

  // Fetch comments (with nested replies)
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

  // Add reply
  const handleAddReply = async (e, parentId, parentUsername) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/api/comments`,
        { postId, content: replyContent, parentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Nested reply update
      const updateReplies = (commentsList) =>
        commentsList.map((c) => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: [...(c.replies || []), res.data],
            };
          }
          if (c.replies) {
            return { ...c, replies: updateReplies(c.replies) };
          }
          return c;
        });

      setComments((prev) => updateReplies(prev));
      setReplyContent("");
      setReplyTo(null);
    } catch (err) {
      console.error("Error adding reply:", err.response?.data || err.message);
      alert("Failed to add reply");
    }
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`${API_URL}/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const removeComment = (commentsList) =>
        commentsList
          .filter((c) => c.id !== commentId)
          .map((c) => ({
            ...c,
            replies: c.replies ? removeComment(c.replies) : [],
          }));

      setComments((prev) => removeComment(prev));
    } catch (error) {
      if (error.response?.status === 403) {
        alert("⚠️ You are not allowed to delete this comment");
      } else {
        alert("Something went wrong while deleting");
      }
      console.error("Error deleting comment:", error);
    }
  };

  // Recursive render function for nested comments
  const renderComments = (commentsList, level = 0) => {
    return commentsList.map((comment) => (
      <div
        key={comment.id}
        className="mt-2"
        style={{ marginLeft: level * 20 }}
      >
        <div className="flex justify-between items-start">
          <p>
            <b>{comment.username}</b>: {comment.content}
          </p>
          <div className="flex gap-2">
            {comment.username === user?.name && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            )}
            {token && (
              <button
                onClick={() => {
                  setReplyTo(comment.id);
                  setReplyContent(`@${comment.username} `);
                }}
                className="text-blue-500 hover:underline"
              >
                Reply
              </button>
            )}
          </div>
        </div>

        {/* Reply form */}
        {replyTo === comment.id && (
          <form
            onSubmit={(e) => handleAddReply(e, comment.id, comment.username)}
            className="flex gap-2 mt-2 ml-6"
          >
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Replying to ${comment.username}...`}
              className="flex-1 border rounded p-2"
              autoFocus
            />
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded"
            >
              Reply
            </button>
          </form>
        )}

        {/* Recursive replies */}
        {comment.replies && renderComments(comment.replies, level + 1)}
      </div>
    ));
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>

      {/* Main comment form */}
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

      {/* Nested comments render */}
      {renderComments(comments)}
    </div>
  );
}
