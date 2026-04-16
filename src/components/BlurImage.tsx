import { useState } from "react";

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
}

const BlurImage = ({ src, alt, className }: BlurImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden bg-surface-subtle shimmer">
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover scale-110 blur-xl transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />

      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full lg:object-cover object-contain transition-all duration-700 ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        } ${className}`}
      />
    </div>
  );
};

export default BlurImage;
