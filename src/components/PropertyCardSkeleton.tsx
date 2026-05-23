export function PropertyCardSkeleton() {
  return (
    <article className="property-card property-card--skeleton" aria-hidden="true">
      <div className="skeleton skeleton-image" />
      <div className="property-card-body">
        <div className="skeleton skeleton-line skeleton-line--lg" />
        <div className="skeleton skeleton-line skeleton-line--sm" />
        <div className="skeleton skeleton-line skeleton-line--md" />
      </div>
    </article>
  );
}
