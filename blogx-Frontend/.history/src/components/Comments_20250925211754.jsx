import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Comments({ postId }) {
  const { user, token, API_URL } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedComments, setExpandedComments] = useState({});

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

  const handleAddReply = async (e, parentId, parentUsername) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/api/comments`,
        { postId, content: replyContent, parentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updateReplies = (list) =>
        list.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), res.data] }
            : { ...c, replies: c.replies ? updateReplies(c.replies) : [] }
        );

      setComments((prev) => updateReplies(prev));
      setReplyContent("");
      setReplyTo(null);
    } catch (err) {
      console.error("Error adding reply:", err.response?.data || err.message);
      alert("Failed to add reply");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`${API_URL}/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const removeComment = (list) =>
        list
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

  const toggleReplies = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const renderComments = (list, level = 0) =>
    list.map((comment) => (
      <div
        key={comment.id}
        className={`bg-gray-50 p-4 rounded-lg shadow-sm border ${level > 0 ? "ml-6 mt-2" : "mt-4"}`}
      >
        <div className="flex justify-between items-start">
          <p className="text-gray-700">
            <span className="font-semibold text-indigo-600">{comment.username}</span>: {comment.content}
          </p>
          <div className="flex gap-3 text-sm">
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
                className="text-indigo-500 hover:underline"
              >
                Reply
              </button>
            )}
          </div>
        </div>

        {replyTo === comment.id && (
          <form
            onSubmit={(e) => handleAddReply(e, comment.id, comment.username)}
            className="flex gap-2 mt-3"
          >
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Replying to ${comment.username}...`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
            >
              Reply
            </button>
          </form>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => toggleReplies(comment.id)}
              className="text-sm text-gray-500 hover:underline"
            >
              {expandedComments[comment.id]
                ? "Hide Replies"
                : `View ${comment.replies.length} Replies`}
            </button>

            {expandedComments[comment.id] &&
              renderComments(comment.replies, level + 1)}
          </div>
        )}
      </div>
    ));

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Comments</h3>

      <form
        onSubmit={handleAddComment}
        className="flex items-center gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm border"
      >
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={token ? "Write your comment..." : "Login to comment"}
          disabled={!token}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!token}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          Post
        </button>
      </form>

      <div className="space-y-4">
        {renderComments(comments)}
      </div>
    </div>
  );
}
