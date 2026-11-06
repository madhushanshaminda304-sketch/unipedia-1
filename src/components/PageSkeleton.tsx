import React from "react";
export function PageSkeleton({
  label,
  detail = false,
}: {
  label: string;
  detail?: boolean;
}) {
  return (
    <div
      className="portal-container page-skeleton"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">
        <div className="skeleton skeleton-heading" />
        <div className="skeleton skeleton-line" />
        {detail ? (
          <div className="skeleton skeleton-detail" />
        ) : (
          <>
            <div className="skeleton skeleton-search" />
            <div className="skeleton-grid">
              {[1, 2, 3].map((i) => (
                <div className="skeleton skeleton-card" key={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
