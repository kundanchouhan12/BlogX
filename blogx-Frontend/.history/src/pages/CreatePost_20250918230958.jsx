import { useState } from "react";
import { usePosts } from "../context/PostsContext";
import axios from "axios";

export default function CreatePost() {
  const { addPost } = usePosts();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/posts", {
        title,
        content,
        imageUrl,
      });
      const newPost = res.data;

      // Ensure required fields exist
      newPost.createdAt = newPost.createdAt || new Date().toISOString();
      newPost.trending = newPost.trending ?? false;
      newPost.category = newPost.category || "General";

      addPost(newPost); // ✅ turant Home me reflect
      setTitle("");
      setContent("");
      setImageUrl("");
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button type="submit">Create Post</button>
    </form>
  );
}
