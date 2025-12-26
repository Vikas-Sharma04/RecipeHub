import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-4 py-8 text-center">
      {/* 404 heading */}
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 text-indigo-500 drop-shadow-lg">
        404
      </h1>

      {/* Subheading */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4">
        Oops! Page Not Found
      </h2>

      {/* Description */}
      <p className="mb-6 text-gray-400 max-w-md text-sm sm:text-base">
        The page you are looking for does not exist, has been moved, or is temporarily unavailable.
      </p>

      {/* Back Home Button */}
      <Link
        to="/"
        className="px-5 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-500 to-pink-500 
        hover:from-pink-500 hover:to-indigo-500 rounded-full 
        text-sm sm:text-base font-semibold shadow-md transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default PageNotFound;
