import { useEffect, useRef, useState } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
}

const LazyImage = ({ src, alt }: LazyImageProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (imgRef.current) observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${
        loaded ? "" : "shimmer"
      }`}
    >
      {!loaded && <div className="absolute inset-0 shimmer" />}
      {isVisible && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-contain transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {!isVisible && <div ref={imgRef} className="w-full h-full" />}
    </div>
  );
};

export default LazyImage;
