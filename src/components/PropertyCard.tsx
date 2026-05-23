import { Link } from 'react-router-dom';
import type { Property } from '../types';
import { getPropertyImageUrl } from '../utils/propertyImage';

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
  const imageUrl = getPropertyImageUrl(property.id);

  return (
    <article className="property-card">
      <Link
        to={`/properties/${property.id}`}
        className="property-card-image-link"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={imageUrl}
          alt=""
          className="property-card-image"
          loading="lazy"
        />
        <span className="property-card-badge">{property.bhk} BHK</span>
      </Link>
      <div className="property-card-body">
        <h3>
          <Link to={`/properties/${property.id}`}>{property.title}</Link>
        </h3>
        <p className="property-location">
          <span className="property-location-icon" aria-hidden="true">
            ◎
          </span>
          {property.location}
        </p>
        <div className="property-meta">
          <span className="property-meta-bhk">{property.bhk} BHK</span>
          <span className="property-price">{formatPrice(property.price)}</span>
        </div>
        <p className="property-desc">{property.description}</p>
        {!showActions && (
          <Link
            to={`/properties/${property.id}#enquiry`}
            className="property-enquire"
          >
            Enquire now <span aria-hidden="true">→</span>
          </Link>
        )}
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
