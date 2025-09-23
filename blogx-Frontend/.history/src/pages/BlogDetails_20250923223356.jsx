import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaArrowLeft } from "react-icons/fa";
import DOMPurify from "dompurify";
import "./BlogDetails.css";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, API_URL } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts/${id}`);
        const commentRes = await axios.get(`${API_URL}/api/comments/post/${id}`);
        setPost({ ...res.data, comments: commentRes.data });
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, API_URL]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(
        `${API_URL}/api/comments`,
        { postId: post.id, content: commentText },
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

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_URL}/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c.id !== commentId),
      }));
    } catch (err) {
      console.error("Error deleting comment:", err.response?.data || err.message);
    }
  };

  const handleEditStart = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  const handleEditSave = async (commentId) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/comments/${commentId}`,
        { content: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c.id === commentId ? res.data : c
        ),
      }));
      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      console.error("Error updating comment:", err.response?.data || err.message);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${API_URL}/api/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (err) {
      console.error("Error deleting post:", err.response?.data || err.message);
      alert("Failed to delete post.");
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!post) return <div className="error">Post not found</div>;

  const isAuthor = user?.name === post.username;

  return (
    <div className="blog-details-container">
      <button className="back-button" onClick={() => navigate("/")}>
        <FaArrowLeft /> Back to Home
      </button>

      <div className="post-card">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-author">
          By <strong>{post.username || "Unknown"}</strong>
        </p>
        {post.imageUrl && <img className="post-image" src={post.imageUrl} alt={post.title} />}

        {/* ✅ Render Mantine RTE HTML safely */}
        <div
          className="post-content prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        {isAuthor && (
          <div className="post-actions-premium">
            <button
              className="btn-premium edit-premium"
              onClick={() => navigate(`/update-post/${post.id}`)}
            >
              ✏️ Edit Post
            </button>
            <button
              className="btn-premium delete-premium"
              onClick={handleDeletePost}
            >
              🗑️ Delete Post
            </button>
          </div>
        )}
      </div>

      <div className="comments-section">
        <h2>Comments</h2>
        {user ? (
          <div className="comment-form">
            <textarea
              className="comment-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
            />
            <button className="btn primary" onClick={handleAddComment}>Add Comment</button>
          </div>
        ) : (
          <p className="login-warning">You must be logged in to comment.</p>
        )}

        <div className="comments-list">
          {post.comments?.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment.id} className="comment-card">
                <p className="comment-author"><strong>{comment.username}</strong>:</p>

                {editingCommentId === comment.id ? (
                  <div className="edit-form">
                    <textarea
                      className="comment-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button className="btn success" onClick={() => handleEditSave(comment.id)}>Save</button>
                    <button className="btn cancel" onClick={() => setEditingCommentId(null)}>Cancel</button>
                  </div>
                ) : (
                  <p className="comment-content">{comment.content}</p>
                )}

                {user?.name === comment.username && (
                  <div className="comment-actions">
                    <button className="btn edit" onClick={() => handleEditStart(comment)}>Edit</button>
                    <button className="btn delete" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
