export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-lg font-semibold">BlogX Platform</p>
        <p className="mt-2 text-gray-400">
          © {new Date().getFullYear()} BlogX. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-indigo-400"
          >
            Twitter
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-indigo-400"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-indigo-400"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
