const HeaderSkeleton = () => {
  return (
    <div className="bg-surface-muted animate-pulse">
      {/* HERO SECTION */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT TEXT */}
            <div className="space-y-6">
              <div className="h-12 bg-border-dark rounded w-3/4"></div>
              <div className="h-6 bg-border-dark rounded w-full"></div>
              <div className="h-6 bg-border-dark rounded w-5/6"></div>
              <div className="h-12 bg-border-dark rounded w-40 mt-4"></div>
            </div>

            {/* RIGHT CAROUSEL */}
            <div className="rounded-xl overflow-hidden shadow-lg h-80 bg-border-dark"></div>
          </div>
        </div>
      </div>

      {/* TOP PRODUCTS */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center mb-12">
            <div className="h-10 w-64 bg-border-dark rounded"></div>
          </div>

          <div className="flex gap-6 overflow-x-auto px-4">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="min-w-[250px] sm:min-w-[280px] md:min-w-[300px]"
              >
                <div className="bg-white rounded-lg shadow p-4 space-y-4">
                  <div className="h-48 bg-border-dark rounded"></div>
                  <div className="h-5 bg-border-dark rounded w-3/4"></div>
                  <div className="h-5 bg-border-dark rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="text-center space-y-4">
              <div className="h-12 w-12 bg-border-dark rounded-full mx-auto"></div>
              <div className="h-5 bg-border-dark rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-border-dark rounded w-2/3 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderSkeleton;
