import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaTimes } from "react-icons/fa";

export default function CreatePost() {
  const { user } = useAuth();
  const { createPost } = usePosts();
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
  if (!user) return setMessage("⚠️ You must be logged in!");
  if (!title.trim() || !content.trim())
    return setMessage("⚠️ Title and content are required.");

  setLoading(true);
  setMessage("");

  try {
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content.trim());
    if (category.trim()) formData.append("category", category.trim());
    if (image) formData.append("image", image);

    await createPost(formData); // ✅ now token is correctly sent

    setTitle("");
    setContent("");
    setCategory("");
    handleRemoveImage();
    setMessage("✅ Post created successfully!");
    navigate("/");
  } catch (err) {
    console.error(err);
    setMessage("❌ Failed to create post.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 space-y-6 transform transition hover:scale-[1.01]">
        <h2 className="text-4xl font-extrabold text-indigo-800 text-center">
          ✍️ Create a New Post
        </h2>

        {message && (
          <div
            className={`p-4 rounded-lg text-sm font-medium ${
              message.startsWith("✅")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-2 text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block mb-2 text-gray-700">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition h-48 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 text-gray-700">
              Category (optional)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Technology, Life, Travel"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 text-gray-700">
              Cover Image (optional)
            </label>
            <label
              htmlFor="image-upload"
              className="relative flex items-center justify-center w-full h-40 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors"
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-full"
                    >
                      <FaTimes /> Remove
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-indigo-400">
                  <FaUpload className="text-4xl" />
                  <span className="mt-2 text-sm">
                    Click to select or drag image here
                  </span>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "🚀 Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
