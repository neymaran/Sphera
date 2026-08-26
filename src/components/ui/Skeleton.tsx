import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string;
  width?:  string;
  circle?: boolean;
}

function Skeleton({ className, height, width, circle = false, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton", circle ? "rounded-full" : "rounded-2xl", className)}
      style={{ height, width, ...style }}
      {...props}
    />
  );
}

// ─── Skeleton Presets ────────────────────────────────
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white rounded-3xl border border-surface-200 shadow-soft-sm p-6 space-y-4", className)}>
      <div className="flex items-center gap-3">
        <Skeleton circle width="40px" height="40px" />
        <div className="flex-1 space-y-2">
          <Skeleton height="14px" width="60%" />
          <Skeleton height="12px" width="40%" />
        </div>
      </div>
      <Skeleton height="12px" />
      <Skeleton height="12px" width="80%" />
      <div className="flex gap-3 pt-2">
        <Skeleton height="32px" width="80px" />
        <Skeleton height="32px" width="60px" />
      </div>
    </div>
  );
}

function SkeletonTable({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("bg-white rounded-3xl border border-surface-200 shadow-soft-sm overflow-hidden", className)}>
      <div className="px-6 py-4 border-b border-surface-100">
        <Skeleton height="16px" width="30%" />
      </div>
      <div className="divide-y divide-surface-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-4">
            <Skeleton circle width="36px" height="36px" />
            <div className="flex-1 space-y-1.5">
              <Skeleton height="13px" width={`${55 + (i * 7) % 30}%`} />
              <Skeleton height="11px" width={`${30 + (i * 13) % 25}%`} />
            </div>
            <Skeleton height="28px" width="70px" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonStatCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white rounded-3xl border border-surface-200 shadow-soft-sm p-6 space-y-3", className)}>
      <div className="flex justify-between items-start">
        <Skeleton height="13px" width="50%" />
        <Skeleton circle width="36px" height="36px" />
      </div>
      <Skeleton height="36px" width="55%" />
      <Skeleton height="11px" width="70%" />
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonStatCard };
