import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import axios from "axios";
import { useState, useEffect } from "react";

export default function UpdatePost() {
  const { token, API_URL } = useAuth();
  const { posts, updatePost, deletePost } = usePosts();
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const post = posts.find((p) => p.id === parseInt(id));
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setPreviewUrl(post.imageUrl || "");
    }
  }, [id, posts]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setMessage("Title and content are required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      if (imageFile) formData.append("image", imageFile);

      const res = await axios.put(`${API_URL}/api/posts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      updatePost(res.data);
      setMessage("Post updated successfully!");
      navigate("/");
    } catch (err) {
      console.error("Update post error:", err.response?.data || err.message);
      setMessage("Failed to update post.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setLoading(true);
    setMessage("");

    try {
      await axios.delete(`${API_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      deletePost(parseInt(id));
      setMessage("Post deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Delete post error:", err.response?.data || err.message);
      setMessage("Failed to delete post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">Update Post</h2>

      {message && (
        <p className={`mb-4 text-sm font-medium ${message.includes("successfully") ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
          <textarea
            placeholder="Write your post content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm h-64 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Image (optional)</label>

          <div className="relative border-2 border-dashed border-indigo-300 rounded-xl p-6 text-center hover:border-indigo-500 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M4 12l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <p className="text-sm text-gray-500">Click or drag to upload an image</p>
            </div>
          </div>

          {previewUrl && (
            <div className="mt-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-3 rounded-full font-semibold text-white transition ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {loading ? "Updating..." : "Update Post"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className={`flex-1 py-3 rounded-full font-semibold text-white bg-red-600 hover:bg-red-700 transition ${loading ? "cursor-not-allowed opacity-70" : ""}`}
          >
            Delete Post
          </button>
        </div>
      </form>
    </div>
  );
}
