const SkeletonLine = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-full bg-[rgb(var(--background))] ${className}`}
  />
);

export const TestListSkeleton = () => {
  return (
    <section className="flex flex-col gap-3">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <SkeletonLine className="h-5 w-3/4" />
              <SkeletonLine className="mt-3 h-4 w-1/2" />
            </div>
            <SkeletonLine className="h-7 w-16" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <SkeletonLine className="h-10 w-full rounded-xl" />
            <SkeletonLine className="h-10 w-full rounded-xl" />
          </div>

          <SkeletonLine className="mt-4 h-11 w-full rounded-xl" />
        </div>
      ))}
    </section>
  );
};
