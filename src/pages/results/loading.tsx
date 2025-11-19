// src/components/SkeletonCard.tsx
export const SkeletonCard = () => {
  return (
    <div className="bg-[rgb(var(--surface))] rounded-2xl border border-[rgb(var(--border))] shadow-md p-5 mb-4 animate-pulse">
      {/* Sarlavha */}
      <div className="h-5 w-2/3 bg-[rgb(var(--border))]/40 rounded mb-4"></div>

      {/* Status va vaqt */}
      <div className="flex justify-between items-center mb-3">
        <div className="h-4 w-16 bg-[rgb(var(--border))]/40 rounded-full"></div>
        <div className="h-4 w-10 bg-[rgb(var(--border))]/40 rounded-full"></div>
      </div>

      {/* Ishtirokchilar soni */}
      <div className="h-4 w-24 bg-[rgb(var(--border))]/40 rounded mb-4"></div>

      {/* Tugma */}
      <div className="h-10 w-full bg-gradient-to-r from-[rgb(var(--border))]/50 to-[rgb(var(--border))]/20 rounded-xl"></div>
    </div>
  );
};
