import { type FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { enquiriesApi } from '../api/enquiries';
import { propertiesApi } from '../api/properties';
import { getErrorMessage, useAuth } from '../context/AuthContext';
import type { Enquiry, Property } from '../types';
import { getPropertyImageUrl } from '../utils/propertyImage';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAgent, isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enquiryForm, setEnquiryForm] = useState({
    name: user?.first_name ?? '',
    email: user?.email ?? '',
    phone: '',
    message: '',
  });
  const [enquirySuccess, setEnquirySuccess] = useState('');
  const [enquiryError, setEnquiryError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await propertiesApi.getById(id);
        setProperty(data);

        if (isAuthenticated && isAgent && data.agent_id === user?.id) {
          const list = await enquiriesApi.listForProperty(id);
          setEnquiries(list);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, isAgent, isAuthenticated, user?.id]);

  useEffect(() => {
    if (!property || window.location.hash !== '#enquiry') return;
    document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' });
  }, [property]);

  const handleEnquiry = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setEnquiryError('');
    setEnquirySuccess('');
    setSubmitting(true);
    try {
      await enquiriesApi.submit({ ...enquiryForm, property_id: id });
      setEnquirySuccess('Enquiry submitted successfully! The agent will contact you soon.');
      setEnquiryForm((prev) => ({ ...prev, message: '', phone: '' }));
    } catch (err) {
      setEnquiryError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page detail-page">
        <div className="detail-skeleton skeleton skeleton-image detail-skeleton-hero" />
        <div className="skeleton skeleton-line skeleton-line--lg" />
        <div className="skeleton skeleton-line skeleton-line--md" />
      </div>
    );
  }

  if (error) return <p className="error">{error}</p>;
  if (!property) return <p className="empty">Property not found.</p>;

  const isOwner = isAgent && user?.id === property.agent_id;
  const imageUrl = getPropertyImageUrl(property.id);

  return (
    <div className="page detail-page">
      <Link to="/" className="back-link">
        ← Back to listings
      </Link>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-hero">
            <img src={imageUrl} alt={property.title} className="detail-hero-image" />
            <span className="detail-hero-badge">{property.bhk} BHK</span>
          </div>

          <article className="detail-card">
            <div className="detail-card-header">
              <div>
                <h1>{property.title}</h1>
                <p className="detail-location">
                  <span aria-hidden="true">◎</span> {property.location}
                </p>
              </div>
              {isOwner && (
                <Link
                  to={`/properties/${property.id}/edit`}
                  className="btn btn-primary btn-sm"
                >
                  Edit property
                </Link>
              )}
            </div>
            <div className="detail-meta">
              <span className="detail-meta-pill">{property.bhk} BHK</span>
              <span className="detail-price">{formatPrice(property.price)}</span>
            </div>
            <p className="detail-description">{property.description}</p>
          </article>

          {isOwner && (
            <section className="enquiries-list">
              <h2>Enquiries ({enquiries.length})</h2>
              {enquiries.length === 0 ? (
                <p className="empty-inline">No enquiries yet for this listing.</p>
              ) : (
                <ul>
                  {enquiries.map((enquiry) => (
                    <li key={enquiry.id} className="enquiry-item">
                      <div className="enquiry-item-header">
                        <strong>{enquiry.name}</strong>
                        <span>{enquiry.phone}</span>
                      </div>
                      <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
                      <p>{enquiry.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>

        {!isOwner && (
          <aside id="enquiry" className="enquiry-section">
            <h2>Enquire about this property</h2>
            <p className="enquiry-section-hint">
              Fill in your details and the listing agent will get back to you.
            </p>
            {enquirySuccess && <p className="success">{enquirySuccess}</p>}
            {enquiryError && <p className="error">{enquiryError}</p>}
            <form onSubmit={handleEnquiry} className="form">
              <label>
                Name
                <input
                  required
                  value={enquiryForm.name}
                  onChange={(e) =>
                    setEnquiryForm({ ...enquiryForm, name: e.target.value })
                  }
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  required
                  value={enquiryForm.email}
                  onChange={(e) =>
                    setEnquiryForm({ ...enquiryForm, email: e.target.value })
                  }
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  required
                  value={enquiryForm.phone}
                  onChange={(e) =>
                    setEnquiryForm({ ...enquiryForm, phone: e.target.value })
                  }
                />
              </label>
              <label>
                Message
                <textarea
                  required
                  rows={4}
                  placeholder="I'm interested in this property..."
                  value={enquiryForm.message}
                  onChange={(e) =>
                    setEnquiryForm({ ...enquiryForm, message: e.target.value })
                  }
                />
              </label>
              <button
                type="submit"
                className="btn btn-accent btn-block"
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Enquire now'}
              </button>
            </form>
          </aside>
        )}
      </div>
    </div>
  );
}
