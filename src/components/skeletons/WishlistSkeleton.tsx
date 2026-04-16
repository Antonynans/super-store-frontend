import { motion } from "framer-motion";

const WishlistSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 space-y-3">
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl shadow-sm p-4 space-y-4"
          >
            <div className="h-40 w-full bg-gray-200 rounded-lg animate-pulse" />

            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />

            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />

            <div className="h-8 w-full bg-gray-200 rounded-lg animate-pulse" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WishlistSkeleton;
