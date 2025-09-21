import { Link } from "react-router-dom";

function BlogCard({ post }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg hover:-translate-y-1 duration-300">
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="blog"
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-5 flex flex-col justify-between h-full">
        <h3 className="text-xl font-bold text-indigo-800 mb-2">
          {post.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4">
          {post.content.substring(0, 100)}...
        </p>

        <Link
          to={`/post/${post.id}`}
          className="text-indigo-600 font-semibold text-sm hover:underline"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}

export default BlogCard;
