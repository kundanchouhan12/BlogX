import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { useNavigate } from "react-router-dom";
import { RichTextEditor } from "@mantine/rte";
import { Select, TextInput } from "@mantine/core";
import { Sun, Moon } from "lucide-react";
import Quill from "quill";

// ✅ Font size whitelist
const Size = Quill.import("attributors/style/size");
Size.whitelist = ["10px", "12px", "14px", "16px", "18px", "24px", "32px", "48px"];
Quill.register(Size, true);

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
  const [darkMode, setDarkMode] = useState(false);

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

  // ✅ Word-style numeric font sizes
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

  const applyFontSize = (val) => {
    document.execCommand("fontSize", false, "7"); // dummy size
    const elements = document.getElementsByTagName("font");
    for (let el of elements) {
      if (el.size === "7") {
        el.removeAttribute("size");
        el.style.fontSize = val;
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-3xl rounded-3xl shadow-2xl p-8 space-y-6 transition ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-bold text-indigo-500">
            ✍️ Create a New Post
          </h2>
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

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

          {/* Rich Text Editor */}
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write your story..."
            className="mb-4"
            controls={[
              ["bold", "italic", "underline", "strike", "clean"],
              ["h1", "h2", "h3", "blockquote", "code"],
              ["unorderedList", "orderedList", "indent", "outdent"],
              ["link", "image", "video", "table"],
              ["alignLeft", "alignCenter", "alignRight", "justify"],
              ["sup", "sub", "color", "background"],
              ["fontFamily", "fontSize"],
              ["divider", "emoji", "codeBlock", "fullscreen"],
            ]}
            // ✅ enable all formats
            formats={[
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              "code",
              "list",
              "bullet",
              "indent",
              "link",
              "image",
              "video",
              "align",
              "script",
              "color",
              "background",
              "font",
              "size",
            ]}
          />

          {/* Word-style Numeric font size */}
          <Select
            label="Font size"
            placeholder="Select size"
            data={fontSizes}
            searchable
            nothingFound="No size"
            onChange={(val) => applyFontSize(val)}
          />

          {/* Direct numeric input also */}
          <TextInput
            label="Custom font size"
            placeholder="Enter e.g. 20px"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyFontSize(e.target.value);
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
