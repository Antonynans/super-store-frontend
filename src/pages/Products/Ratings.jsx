import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text, color }) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars > 0.5 ? 1 : 0;
  const emptyStar = 5 - fullStars - halfStars;

  const colorMap = {
    "yellow-500": "#eab308",
    "pink-500": "#ec4899",
    "blue-500": "#3b82f6",
    "red-500": "#ef4444",
    "green-500": "#22c55e",
  };

  const starColor = colorMap[color] || "#eab308";

  return (
    <div className="flex items-center gap-0">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar
          key={`full-${index}`}
          style={{ color: starColor }}
          className="text-lg"
        />
      ))}

      {halfStars === 1 && (
        <FaStarHalfAlt style={{ color: starColor }} className="text-lg" />
      )}

      {[...Array(emptyStar)].map((_, index) => (
        <FaRegStar
          key={`empty-${index}`}
          style={{ color: starColor }}
          className="text-lg"
        />
      ))}

      {text && (
        <span className="ml-3 text-sm font-medium text-gray-700">{text}</span>
      )}
    </div>
  );
};

Ratings.defaultProps = {
  color: "yellow-500",
};

export default Ratings;
