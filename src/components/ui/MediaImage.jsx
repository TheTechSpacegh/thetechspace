// An <img> that degrades to a branded placeholder when content has no image
// yet (e.g. a new post or team member saved without one).
import { cn } from "@/lib/utils";

export default function MediaImage({ src, alt = "", label, className, ...props }) {
  if (src) return <img src={src} alt={alt} className={className} {...props} />;
  const initials = (label || alt || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn("grid place-items-center bg-gradient-to-br from-violet-200 via-violet-100 to-sky-100 text-violet-700", className)}
    >
      {initials && <span className="text-2xl font-semibold tracking-tight">{initials}</span>}
    </div>
  );
}
