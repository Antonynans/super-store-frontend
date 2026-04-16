import { useEffect, useRef, useState } from "react";
interface ProductImageProps {
  src: string;
  alt: string;
  wrapperClassName?: string;
}

const ProductImage = ({ src, alt, wrapperClassName }: ProductImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
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

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${wrapperClassName ?? ""}`}
    >
      {!loaded && <div className="absolute inset-0 shimmer" />}

      {isVisible && (
        <>
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover scale-110 blur-xl transition-opacity duration-500 ${loaded ? "opacity-0" : "opacity-100"}`}
          />
          <img
            src={src}
            alt={alt}
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
          />
        </>
      )}
    </div>
  );
};

export default ProductImage;
