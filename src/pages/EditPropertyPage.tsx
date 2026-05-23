import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { propertiesApi } from '../api/properties';
import { PropertyForm } from '../components/PropertyForm';
import { getErrorMessage, useAuth } from '../context/AuthContext';
import type { Property } from '../types';

export function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAgent, isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await propertiesApi.getById(id);
        setProperty(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <p className="loading">Loading property...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!property) return <p className="empty">Property not found.</p>;

  const isOwner =
    isAuthenticated && isAgent && user?.id === property.agent_id;

  if (!isOwner) {
    return <Navigate to={`/properties/${property.id}`} replace />;
  }

  return (
    <div className="page">
      <Link to={`/properties/${property.id}`} className="back-link">
        &larr; Back to property
      </Link>

      <div className="page-header">
        <h1>Edit Property</h1>
        <p>Update your listing details</p>
      </div>

      <PropertyForm
        key={property.id}
        initialValues={{
          title: property.title,
          description: property.description,
          location: property.location,
          bhk: String(property.bhk),
          price: String(property.price),
        }}
        submitLabel="Save changes"
        submittingLabel="Saving..."
        onSubmit={async (values) => {
          await propertiesApi.update(property.id, values);
          navigate(`/properties/${property.id}`);
        }}
      />
    </div>
  );
}
