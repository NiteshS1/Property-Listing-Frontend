import { useCallback, useEffect, useState } from 'react';
import { propertiesApi } from '../api/properties';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyFiltersBar } from '../components/PropertyFilters';
import { PropertyGridSkeleton } from '../components/PropertyGridSkeleton';
import { getErrorMessage } from '../context/AuthContext';
import type { Property, PropertyFilters } from '../types';

export function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (activeFilters: PropertyFilters) => {
    setLoading(true);
    setError('');
    try {
      const data = await propertiesApi.list(activeFilters);
      setProperties(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load({});
  }, [load]);

  return (
    <div className="page listings-page">
      <section className="page-hero">
        <div className="page-hero-content">
          <p className="page-hero-eyebrow">Verified listings</p>
          <h1>Discover your next home</h1>
          <p className="page-hero-subtitle">
            Browse properties across India. Filter by location, configuration,
            and budget to find the right match.
          </p>
        </div>
      </section>

      <PropertyFiltersBar
        filters={filters}
        onChange={setFilters}
        onSubmit={(active) => load(active ?? filters)}
      />

      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <p className="results-count" aria-live="polite">
          {properties.length === 0
            ? 'No properties match your search'
            : `${properties.length} propert${properties.length === 1 ? 'y' : 'ies'} found`}
        </p>
      )}

      {loading && <PropertyGridSkeleton />}

      {!loading && !error && properties.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            ⌂
          </span>
          <h2>No properties found</h2>
          <p>Try adjusting your filters or search in a different location.</p>
        </div>
      )}

      {!loading && properties.length > 0 && (
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
