import { PropertyCardSkeleton } from './PropertyCardSkeleton';

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="property-grid" aria-busy="true" aria-label="Loading properties">
      {Array.from({ length: count }, (_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
