import { Link } from "react-router-dom";

function BlogCard({ post }) {
  return (
    <div className="border rounded p-3 mb-3">
      <h3 className="text-xl font-bold">{post.title}</h3>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="blog" className="w-64 my-2" />
      )}
      <p>{post.content.substring(0, 100)}...</p>
      <Link to={`/post/${post.id}`} className="text-blue-500">Read More</Link>
    </div>
  );
}

export default BlogCard;
