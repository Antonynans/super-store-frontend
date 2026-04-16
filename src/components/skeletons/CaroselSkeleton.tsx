const CarouselSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="w-full h-80 bg-border-dark relative overflow-hidden">
        <div className="absolute inset-0 shimmer"></div>
      </div>

      <div className="bg-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-8 bg-border-dark rounded w-3/4 relative overflow-hidden">
              <div className="shimmer"></div>
            </div>

            <div className="h-6 bg-border-dark rounded w-1/3 relative overflow-hidden">
              <div className="shimmer"></div>
            </div>

            <div className="h-4 bg-border-dark rounded w-full relative overflow-hidden">
              <div className="shimmer"></div>
            </div>

            <div className="h-4 bg-border-dark rounded w-5/6 relative overflow-hidden">
              <div className="shimmer"></div>
            </div>

            <div className="h-10 bg-border-dark rounded w-40 relative overflow-hidden">
              <div className="shimmer"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-border-dark rounded w-1/2 relative overflow-hidden">
                  <div className="shimmer"></div>
                </div>
                <div className="h-4 bg-border-dark rounded w-3/4 relative overflow-hidden">
                  <div className="shimmer"></div>
                </div>
              </div>
            ))}

            <div className="col-span-2 h-16 bg-border-dark rounded relative overflow-hidden">
              <div className="shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselSkeleton;
