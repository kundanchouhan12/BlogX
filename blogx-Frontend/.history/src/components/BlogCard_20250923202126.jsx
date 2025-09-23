import { Link } from "react-router-dom";
import { FaUserEdit, FaCalendarAlt } from "react-icons/fa";

function BlogCard({ post }) {
  // Fallback values for cleaner rendering
  const authorName = post.username || "Anonymous";
  const postDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A";

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-48 object-cover object-center transform hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-xl font-bold text-indigo-800 hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
            <Link to={`/post/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {post.content}
          </p>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4 mt-auto">
          <div className="flex items-center gap-2">
            <FaUserEdit className="text-indigo-500" />
            <span>By {authorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-indigo-500" />
            <span>{postDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;