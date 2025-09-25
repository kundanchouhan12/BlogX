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
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedComments, setExpandedComments] = useState({});

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

  const isAuthor = user?.name === post?.username;

  // Add new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
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
      console.error(err);
      alert("Failed to add comment");
    }
  };

  // Add reply to a comment
  const handleAddReply = async (parentId) => {
    if (!replyContent.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/api/comments`,
        { postId: post.id, content: replyContent, parentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updateReplies = (list) =>
        list.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), res.data] }
            : { ...c, replies: c.replies ? updateReplies(c.replies) : [] }
        );

      setPost((prev) => ({ ...prev, comments: updateReplies(prev.comments) }));
      setReplyContent("");
      setReplyTo(null);
    } catch (err) {
      console.error(err);
      alert("Failed to add reply");
    }
  };

  // Delete comment (recursive)
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_URL}/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const removeComment = (list) =>
        list
          .filter((c) => c.id !== commentId)
          .map((c) => ({ ...c, replies: c.replies ? removeComment(c.replies) : [] }));

      setPost((prev) => ({ ...prev, comments: removeComment(prev.comments) }));
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment");
    }
  };

  // Edit comment
  const handleEditSave = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.put(
        `${API_URL}/api/comments/${commentId}`,
        { content: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updateComment = (list) =>
        list.map((c) =>
          c.id === commentId
            ? res.data
            : { ...c, replies: c.replies ? updateComment(c.replies) : [] }
        );

      setPost((prev) => ({ ...prev, comments: updateComment(prev.comments) }));
      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      console.error(err);
      alert("Failed to update comment");
    }
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${API_URL}/api/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
    }
  };

  // Toggle replies visibility
  const toggleReplies = (commentId) => {
    setExpandedComments((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  // Recursive render comments
  const renderComments = (list, level = 0) =>
    list.map((comment) => (
      <div key={comment.id} style={{ marginLeft: level * 20, marginTop: 8 }}>
        <div className="flex justify-between items-start">
          <p>
            <b>{comment.username}</b>:{" "}
            {editingCommentId === comment.id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="border p-1 rounded"
              />
            ) : (
              comment.content
            )}
          </p>
          <div className="flex gap-2">
            {comment.username === user?.name && editingCommentId !== comment.id && (
              <button onClick={() => { setEditingCommentId(comment.id); setEditText(comment.content); }}>
                Edit
              </button>
            )}
            {editingCommentId === comment.id && (
              <>
                <button onClick={() => handleEditSave(comment.id)}>Save</button>
                <button onClick={() => setEditingCommentId(null)}>Cancel</button>
              </>
            )}
            {comment.username === user?.name && (
              <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
            )}
            {token && (
              <button
                onClick={() => {
                  setReplyTo(comment.id);
                  setReplyContent(`@${comment.username} `);
                }}
              >
                Reply
              </button>
            )}
          </div>
        </div>

        {/* Reply form */}
        {replyTo === comment.id && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddReply(comment.id);
            }}
            style={{ marginLeft: 20, marginTop: 4 }}
          >
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Replying to ${comment.username}`}
              autoFocus
              className="border p-1 rounded"
            />
            <button type="submit" className="ml-2">Reply</button>
          </form>
        )}

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div style={{ marginLeft: 20 }}>
            <button onClick={() => toggleReplies(comment.id)} className="text-sm text-gray-500">
              {expandedComments[comment.id]
                ? "Hide Replies"
                : `View ${comment.replies.length} Replies`}
            </button>
            {expandedComments[comment.id] && renderComments(comment.replies, level + 1)}
          </div>
        )}
      </div>
    ));

  if (loading) return <div className="loader">Loading...</div>;
  if (!post) return <div className="error">Post not found</div>;

  return (
    <div className="blog-details-container">
      <button className="back-button" onClick={() => navigate("/")}>
        <FaArrowLeft /> Back to Home
      </button>

      <div className="post-card">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-author">By <strong>{post.username || "Unknown"}</strong></p>
        {post.imageUrl && <img className="post-image" src={post.imageUrl} alt={post.title} />}
        <div
          className="post-content prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />
        {isAuthor && (
          <div className="post-actions-premium">
            <button onClick={() => navigate(`/update-post/${post.id}`)}>✏️ Edit Post</button>
            <button onClick={handleDeletePost}>🗑️ Delete Post</button>
          </div>
        )}
      </div>

      {/* Add top-level comment */}
      {token ? (
        <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border p-2 rounded"
          />
          <button type="submit" className="bg-indigo-500 text-white px-4 rounded">Post</button>
        </form>
      ) : (
        <p className="mt-4">Login to comment.</p>
      )}

      {/* Comments */}
      <div className="mt-4">{post.comments && renderComments(post.comments)}</div>
    </div>
  );
};

export default BlogDetails;
