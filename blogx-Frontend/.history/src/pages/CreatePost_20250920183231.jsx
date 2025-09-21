import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const { user, token } = useAuth();
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
      return setMessage("⚠️ Title and content required.");

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      if (category.trim()) formData.append("category", category.trim());
      if (image) formData.append("image", image);

      await createPost(formData);

      setTitle("");
      setContent("");
      setCategory("");
      setImage(null);
      setPreview(null);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-2xl transition-transform hover:scale-[1.01]">
        <h2 className="text-4xl font-bold text-indigo-800 mb-8 text-center">
          ✍️ Create a New Post
        </h2>

        {message && (
          <p className={`mb-6 text-sm font-medium ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
          <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-3 border rounded-lg h-64" />
          <input type="text" placeholder="Category (optional)" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />

          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-500" />
          {preview && (
            <div>
              <img src={preview} alt="Preview" className="h-48 w-full object-cover rounded-xl mt-2" />
              <button type="button" onClick={handleRemoveImage} className="px-4 py-2 bg-red-500 text-white rounded-full mt-2">Remove</button>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 rounded-full text-white bg-indigo-600 hover:bg-indigo-700">
            {loading ? "Creating..." : "🚀 Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
