const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-border w-full" />

      <div className="p-4 space-y-3">
        <div className="h-4 bg-border rounded w-3/4" />
        <div className="h-3 bg-border rounded w-1/2" />

        <div className="h-3 bg-border rounded w-1/3" />

        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-border rounded w-1/4" />
          <div className="h-8 bg-border rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
