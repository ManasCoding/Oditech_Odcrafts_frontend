export function ProductCardSkeleton() {
  return (
    <div className="h-full flex flex-col rounded-xl bg-white border border-warm-gray/15 overflow-hidden animate-pulse">
      <div className="aspect-square w-full bg-warm-gray/10 shrink-0" />
      <div className="flex-1 flex flex-col p-2.5 sm:p-3 justify-between">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <div className="h-2.5 w-14 bg-warm-gray/15 rounded" />
            <div className="h-2.5 w-10 bg-warm-gray/15 rounded" />
          </div>
          <div className="h-[2.5rem] sm:h-[2.75rem] space-y-1.5 overflow-hidden">
            <div className="h-3 sm:h-3.5 w-full bg-warm-gray/15 rounded" />
            <div className="h-3 sm:h-3.5 w-3/4 bg-warm-gray/15 rounded" />
          </div>
          <div className="h-2.5 w-16 bg-warm-gray/10 rounded mt-1.5" />
        </div>
        <div className="mt-2 pt-2 border-t border-warm-gray/10 flex justify-between items-center">
          <div className="h-3.5 sm:h-4 w-14 bg-warm-gray/20 rounded" />
          <div className="h-3 w-8 bg-warm-gray/10 rounded" />
        </div>
      </div>
    </div>
  );
}
