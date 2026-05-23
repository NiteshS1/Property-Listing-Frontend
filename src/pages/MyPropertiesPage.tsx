import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertiesApi } from '../api/properties';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyGridSkeleton } from '../components/PropertyGridSkeleton';
import { getErrorMessage } from '../context/AuthContext';
import type { Property } from '../types';

export function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await propertiesApi.mine();
      setProperties(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this property?')) return;
    try {
      await propertiesApi.remove(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Properties</h1>
          <p>Manage your listings and track enquiries</p>
        </div>
        <Link to="/add-property" className="btn btn-primary">
          + Add listing
        </Link>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <PropertyGridSkeleton count={3} />}

      {!loading && properties.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            +
          </span>
          <h2>No listings yet</h2>
          <p>Create your first property listing to reach home seekers.</p>
          <Link to="/add-property" className="btn btn-primary">
            Add your first property
          </Link>
        </div>
      )}

      {!loading && properties.length > 0 && (
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              showActions
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
