function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-gray-100 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

export default function ProductDetailsSkeleton() {
  return (
    <div className="bg-surface-subtle min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-lg" />
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="w-32 h-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14">
          <div className="space-y-3">
            <Skeleton
              className="w-full rounded-2xl shimmer md:h-[38rem] h-48"
            />

            <div className="flex gap-2.5 py-1">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="flex-shrink-0 w-[68px] h-[68px] rounded-xl shimmer"
                />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-border-default p-6 md:p-8 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-8 w-4/5" />
                  <Skeleton className="h-8 w-3/5" />
                </div>
                <Skeleton className="w-20 h-6 rounded-full flex-shrink-0" />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="w-4 h-4 rounded-sm" />
                  ))}
                </div>
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-28 h-4" />
              </div>

              <div className="space-y-2 pt-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border-default p-6 md:p-8 space-y-6">
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-10 w-28" />
              </div>

              <div className="flex items-center gap-4">
                <Skeleton className="w-32 h-10 rounded-xl" />
                <Skeleton className="w-24 h-4" />
              </div>

              <div className="flex gap-3">
                <Skeleton className="flex-1 h-14 rounded-xl" />
                <Skeleton className="w-14 h-14 rounded-xl" />
              </div>

              <div className="space-y-3 pt-4 border-t border-border-default">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Skeleton className="w-4 h-4 rounded-full flex-shrink-0" />
                    <Skeleton
                      className={`h-4 ${i === 0 ? "w-48" : i === 1 ? "w-44" : "w-36"}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-white rounded-2xl border border-border-default p-6 md:p-8 space-y-5">
          <div className="flex gap-6 border-b border-border-default pb-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>

          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="space-y-2 py-4 border-b border-border-default last:border-0"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="flex gap-1 pl-12">
                {[...Array(5)].map((_, j) => (
                  <Skeleton key={j} className="w-3.5 h-3.5 rounded-sm" />
                ))}
              </div>
              <div className="space-y-1.5 pl-12">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
