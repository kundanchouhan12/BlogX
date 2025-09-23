import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { useNavigate } from "react-router-dom";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function CreatePost() {
  const { user, token } = useAuth();
  const { createPost } = usePosts();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Initialize editor state
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

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
    if (!title.trim())
      return setMessage("⚠️ Title is required.");

    const contentHtml = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    if (!contentHtml || contentHtml === "<p></p>\n")
      return setMessage("⚠️ Content is required.");

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", contentHtml);
      if (category) formData.append("category", category.trim());
      if (image) formData.append("image", image);

      await createPost(formData);

      setTitle("");
      setEditorState(EditorState.createEmpty());
      setCategory("");
      handleRemoveImage();
      setMessage("✅ Post created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Create post error:", err.response?.data || err.message);
      setMessage("❌ Failed to create post. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

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

          {/* Rich Text Editor */}
          <Editor
            editorState={editorState}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class border rounded-lg h-96 p-2"
            toolbarClassName="toolbar-class"
            onEditorStateChange={setEditorState}
            toolbar={{
              options: [
                "inline",
                "blockType",
                "fontSize",
                "fontFamily",
                "list",
                "textAlign",
                "colorPicker",
                "link",
                "emoji",
                "image",
                "history",
              ],
              inline: {
                options: [
                  "bold",
                  "italic",
                  "underline",
                  "strikethrough",
                  "monospace",
                ],
              },
              list: { options: ["unordered", "ordered", "indent", "outdent"] },
              textAlign: { options: ["left", "center", "right", "justify"] },
              link: { options: ["link", "unlink"] },
              history: { options: ["undo", "redo"] },
              image: { uploadEnabled: false }, // optional: handle image upload separately
            }}
          />

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
            className="w-full py-3 bg-indigo-600 text-white rounded-full"
          >
            {loading ? "Creating..." : "🚀 Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
