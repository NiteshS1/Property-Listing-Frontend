import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertiesApi } from '../api/properties';
import { PropertyCard } from '../components/PropertyCard';
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
        <h1>My Properties</h1>
        <Link to="/add-property" className="btn btn-primary">
          Add new
        </Link>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}

      {!loading && properties.length === 0 && (
        <p className="empty">
          You have no listings yet.{' '}
          <Link to="/add-property">Add your first property</Link>
        </p>
      )}

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
    </div>
  );
}
