import { motion } from "framer-motion";

const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent overflow-hidden relative";

const CartLoader = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10 space-y-3"
        >
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 bg-white p-4 rounded-lg shadow-md"
              >
                <div
                  className={`h-24 w-24 rounded-lg bg-gray-200 ${shimmer}`}
                />

                <div className="flex flex-1 flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div
                      className={`h-4 w-40 bg-gray-200 rounded ${shimmer}`}
                    />
                    <div
                      className={`h-3 w-24 bg-gray-200 rounded ${shimmer}`}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-3 w-10 bg-gray-200 rounded" />
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded" />
                      <div className="h-8 w-10 bg-gray-200 rounded" />
                      <div className="h-8 w-8 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <div className="space-y-2">
                    <div
                      className={`h-5 w-20 bg-gray-200 rounded ${shimmer}`}
                    />
                    <div
                      className={`h-3 w-16 bg-gray-200 rounded ${shimmer}`}
                    />
                  </div>

                  <div className="h-8 w-8 bg-gray-200 rounded" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />

            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            ))}

            <div className="flex justify-between mt-4">
              <div className="h-4 w-24 bg-gray-300 rounded" />
              <div className="h-6 w-20 bg-gray-300 rounded" />
            </div>

            <div className="h-12 w-full bg-gray-200 rounded-lg mt-4" />
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default CartLoader;
