import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BlogDetails = () => {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  // ✅ Fetch Post Details + Comments
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/posts/${id}`);
        setPost(res.data);

        // Fetch comments for this post
        const commentRes = await axios.get(
          `http://localhost:8080/api/comments/post/${id}`
        );
        setPost((prev) => ({ ...res.data, comments: commentRes.data }));
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // ✅ Add Comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:8080/api/comments",
        {
          postId: post.id,
          content: commentText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
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

  // ✅ Delete Comment
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
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

  // ✅ Start Edit Mode
  const handleEditStart = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  // ✅ Save Edited Comment
  const handleEditSave = async (commentId) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/comments/${commentId}`,
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

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="blog-details">
      <h1>{post.title}</h1>
      <p>By <strong>{post.username || "Unknown"}</strong></p>
      <img src={post.imageUrl} alt={post.title} style={{ width: "300px" }} />
      <p>{post.content}</p>

      <hr />

      {/* ✅ Comment Section */}
      <h2>Comments</h2>

      {/* Add Comment */}
      {user ? (
        <div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>
      ) : (
        <p><i>You must be logged in to comment.</i></p>
      )}

      {/* Show Comments */}
      <div className="comments-list">
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <div key={comment.id} style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
              <p><strong>{comment.username}</strong>:</p>

              {editingCommentId === comment.id ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => handleEditSave(comment.id)}>Save</button>
                  <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                </div>
              ) : (
                <p>{comment.content}</p>
              )}

              {/* ✅ Show buttons only if this is user's comment */}
              {user?.name === comment.username && (
                <div>
                  <button onClick={() => handleEditStart(comment)}>Edit</button>
                  <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
