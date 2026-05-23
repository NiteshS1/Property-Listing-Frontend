import { Link } from 'react-router-dom';
import type { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function PropertyCard({
  property,
  showActions,
  onDelete,
}: PropertyCardProps) {
  return (
    <article className="property-card">
      <div className="property-card-body">
        <h3>
          <Link to={`/properties/${property.id}`}>{property.title}</Link>
        </h3>
        <p className="property-location">{property.location}</p>
        <div className="property-meta">
          <span>{property.bhk} BHK</span>
          <span className="property-price">{formatPrice(property.price)}</span>
        </div>
        <p className="property-desc">{property.description}</p>
      </div>
      {showActions && onDelete && (
        <div className="property-card-actions">
          <Link
            to={`/properties/${property.id}`}
            className="btn btn-ghost btn-sm"
          >
            View
          </Link>
          <Link
            to={`/properties/${property.id}/edit`}
            className="btn btn-ghost btn-sm"
          >
            Edit
          </Link>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(property.id)}
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
