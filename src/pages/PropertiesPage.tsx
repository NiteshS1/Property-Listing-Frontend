import { useCallback, useEffect, useState } from 'react';
import { propertiesApi } from '../api/properties';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyFiltersBar } from '../components/PropertyFilters';
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
    <div className="page">
      <div className="page-header">
        <h1>Property Listings</h1>
        <p>Search by location, BHK, and price range</p>
      </div>

      <PropertyFiltersBar
        filters={filters}
        onChange={setFilters}
        onSubmit={() => load(filters)}
      />

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading properties...</p>}

      {!loading && !error && properties.length === 0 && (
        <p className="empty">No properties found. Try adjusting your filters.</p>
      )}

      <div className="property-grid">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
