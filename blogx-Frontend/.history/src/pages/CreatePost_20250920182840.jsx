import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const { user } = useAuth();
  const { createPost } = usePosts(); // 🔹 Corrected (was addPost)
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("⚠️ You must be logged in to create a post!");
      return;
    }
    if (!title.trim() || !content.trim()) {
      setMessage("⚠️ Title and content are required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      if (category.trim()) formData.append("category", category.trim());
      if (image) formData.append("image", image);

      // ✅ Call context createPost (it handles axios + state update)
      await createPost(formData);

      // reset form
      setTitle("");
      setContent("");
      setCategory("");
      setImage(null);
      setPreview(null);
      setMessage("✅ Post created successfully!");
      navigate("/");
    } catch (err) {
      console.error("❌ Create post error:", err.response?.data || err.message);
      setMessage("❌ Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-2xl transition-transform transform hover:scale-[1.01]">
        <h2 className="text-4xl font-bold text-indigo-800 mb-8 text-center">
          ✍️ Create a New Post
        </h2>

        {message && (
          <p
            className={`mb-6 text-sm font-medium flex items-center gap-2 ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-400"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Content
            </label>
            <textarea
              placeholder="Write your post content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm h-64 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Category (optional)
            </label>
            <input
              type="text"
              placeholder="E.g. Tech, Lifestyle, Travel"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-400"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Image (optional)
            </label>
            <div className="relative w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100 transition"
              />
            </div>

            {preview && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="h-48 w-full object-cover rounded-xl border border-gray-200 shadow mb-4"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition"
                >
                  ❌ Remove Image
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full font-semibold text-white transition-all duration-300 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            }`}
          >
            {loading ? "Creating..." : "🚀 Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
