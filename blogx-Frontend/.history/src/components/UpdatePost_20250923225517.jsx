import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { useState, useEffect } from "react";
import { RichTextEditor } from "@mantine/rte";

export default function UpdatePost() {
  const { token, API_URL } = useAuth();
  const { posts, updatePost } = usePosts();
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
      setContent(post.content); // HTML from Mantine RTE
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
      formData.append("content", content); // HTML
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${API_URL}/api/posts/${id}`, {
        method: "PUT",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      updatePost(data);
      setMessage("Post updated successfully!");
      navigate("/");
    } catch (err) {
      console.error("Update post error:", err);
      setMessage("Failed to update post.");
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
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full px-4 py-3 border rounded-lg"
        />

        <RichTextEditor
          value={content}
          onChange={setContent}
          className="h-64"
          controls={[
            ["bold", "italic", "underline", "strike", "clean"],
            ["h1", "h2", "h3", "blockquote", "code"],
            ["unorderedList", "orderedList", "indent", "outdent"],
            ["link", "image", "video"],
            ["alignLeft", "alignCenter", "alignRight"],
            ["sup", "sub", "color", "background"],
          ]}
        />

        <input type="file" onChange={handleImageChange} />
        {previewUrl && <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-cover rounded-lg mt-4" />}

        <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-full">
          {loading ? "Updating..." : "Update Post"}
        </button>
      </form>

      {/* ✅ Mantine RTE custom scrollable style */}
      <style jsx>{`
        .mantine-RichTextEditor-root {
          min-height: 350px;
          max-height: 500px; /* scroll for large content */
          overflow-y: auto;
          word-wrap: break-word; 
          overflow-wrap: break-word;
          white-space: pre-wrap; /* preserve line breaks */
        }
      `}</style>
    </div>
  );
}
