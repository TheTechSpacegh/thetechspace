// Placeholder shown while a page's content loads from the API (first visit
// only; later visits in the same tab render from cache instantly).
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ContentSkeleton({ variant = "grid", count = 3, className }) {
  if (variant === "split") {
    return (
      <div aria-busy="true" aria-label="Loading" className={cn("mx-auto grid max-w-6xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-2", className)}>
        <div className="flex flex-col gap-3">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        <Skeleton className="aspect-[4/3] rounded-2xl" />
      </div>
    );
  }
  if (variant === "timeline") {
    return (
      <div aria-busy="true" aria-label="Loading" className={cn("flex flex-col gap-6", className)}>
        {Array.from({ length: count }, (_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    );
  }
  return (
    <div aria-busy="true" aria-label="Loading" className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="aspect-[4/3] rounded-2xl" />
          <Skeleton className="h-5 w-2/3 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}
