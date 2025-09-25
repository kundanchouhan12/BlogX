import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { useNavigate } from "react-router-dom";
import { RichTextEditor } from "@mantine/rte";
import { Select } from "@mantine/core";

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
      formData.append("content", content); // HTML
      if (category) formData.append("category", category.trim());
      if (image) formData.append("image", image);

      await createPost(formData);

      setTitle("");
      setContent("");
      setCategory("");
      handleRemoveImage();
      setMessage("✅ Post created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Create post error:", err.response?.data || err.message);
      setMessage("❌ Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Custom font sizes like Word
  const fontSizes = [
    { value: "10px", label: "10" },
    { value: "12px", label: "12" },
    { value: "14px", label: "14" },
    { value: "16px", label: "16" },
    { value: "18px", label: "18" },
    { value: "24px", label: "24" },
    { value: "32px", label: "32" },
    { value: "48px", label: "48" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <h2 className="text-4xl font-bold text-center text-indigo-700">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full px-4 py-3 border rounded-lg"
          />

          {/* Rich Text Editor with custom font size */}
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write your story..."
            className="mb-4"
            controls={[
              ["bold", "italic", "underline", "strike", "clean"],
              ["h1", "h2", "h3", "blockquote", "code"],
              ["unorderedList", "orderedList", "indent", "outdent"],
              ["link", "image", "video"],
              ["alignLeft", "alignCenter", "alignRight"],
              ["sup", "sub", "color", "background"],
              ["fontFamily"], // ✅ dropdown
              ["fontSize"], // ✅ basic font size
              ["divider", "fullscreen"],
            ]}
          />

          {/* ✅ Extra: Numeric font size dropdown like Word */}
          <Select
            label="Font size"
            placeholder="Select size"
            data={fontSizes}
            searchable
            nothingFound="No size"
            onChange={(val) => {
              document.execCommand("fontSize", false, "7"); // apply dummy
              const elements = document.getElementsByTagName("font");
              for (let el of elements) {
                if (el.size === "7") {
                  el.removeAttribute("size");
                  el.style.fontSize = val;
                }
              }
            }}
          />

          <style jsx>{`
            .mantine-RichTextEditor-root {
              min-height: 350px;
              max-height: 500px;
              overflow-y: auto;
              word-wrap: break-word;
              overflow-wrap: break-word;
              white-space: pre-wrap;
            }
          `}</style>

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (optional)"
            className="w-full px-4 py-3 border rounded-lg"
          />

          <label className="relative flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer">
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute z-10 px-3 py-2 bg-red-600 text-white rounded-full"
                >
                  Remove
                </button>
              </>
            ) : (
              <span className="text-gray-400">Click to upload image</span>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
          >
            {loading ? "Creating..." : "🚀 Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
