import { FaStar } from "react-icons/fa";

interface RatingsProps {
  value: number;
  text?: string;
}

const Ratings = ({ value, text }: RatingsProps) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => {
          const ratingValue = value;
          if (i < Math.floor(ratingValue)) {
            return <FaStar key={i} style={{ color: "#f59e0b" }} size={14} />;
          } else if (i < ratingValue) {
            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                }}
              >
                <FaStar
                  style={{
                    position: "absolute",
                    color: "#6b7280",
                    left: 0,
                    top: 0,
                  }}
                  size={14}
                />

                <FaStar
                  style={{
                    position: "absolute",
                    color: "#f59e0b",
                    left: 0,
                    top: 0,
                    clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                  }}
                  size={14}
                />
              </div>
            );
          } else {
            return <FaStar key={i} style={{ color: "#6b7280" }} size={14} />;
          }
        })}
      </div>
      <div className="flex items-center gap-8">
        <span className="text-text-primary font-semibold text-sm">
          {Math.round(value * 2) / 2}
        </span>
        {text && (
          <span className="text-sm font-medium text-text-secondary">
            {text}
          </span>
        )}
      </div>
    </div>
  );
};

Ratings.defaultProps = {
  value: 0,
};

export default Ratings;
