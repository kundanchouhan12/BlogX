import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaArrowLeft } from "react-icons/fa";
import "./BlogDetails.css"; // ✅ Import your CSS file

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await axios.get(`http://localhost:8080/api/posts/${id}`);
        const commentRes = await axios.get(
          `http://localhost:8080/api/comments/post/${id}`
        );
        setPost({ ...res.data, comments: commentRes.data });
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  // … (all your existing comment & delete logic)

  if (loading) return <div className="loader">Loading...</div>;
  if (!post) return <div className="error">Post not found</div>;

  const isAuthor = user?.name === post.username;

  return (
    <div className="blog-details-container">
      {/* ───── Stylish Back Button ───── */}
      <button
        className="back-button"
        onClick={() => navigate("/")}
        aria-label="Go back to home"
      >
        <FaArrowLeft />
        Back to Home
      </button>

      <div className="post-card">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-author">
          By <strong>{post.username || "Unknown"}</strong>
        </p>
        {post.imageUrl && (
          <img
            className="post-image"
            src={post.imageUrl}
            alt={post.title}
          />
        )}
        <p className="post-content">{post.content}</p>

        {isAuthor && (
          <div className="post-actions">
            <button
              className="btn edit"
              onClick={() => navigate(`/update-post/${post.id}`)}
            >
              Edit Post
            </button>
            <button className="btn delete" onClick={handleDeletePost}>
              Delete Post
            </button>
          </div>
        )}
      </div>

      {/* ───── Comments Section (unchanged) ───── */}
      <div className="comments-section">
        {/* … */}
      </div>
    </div>
  );
};

export default BlogDetails;
