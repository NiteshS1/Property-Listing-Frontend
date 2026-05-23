import { type FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { enquiriesApi } from '../api/enquiries';
import { propertiesApi } from '../api/properties';
import { getErrorMessage, useAuth } from '../context/AuthContext';
import type { Enquiry, Property } from '../types';

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

  const handleEnquiry = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setEnquiryError('');
    setEnquirySuccess('');
    setSubmitting(true);
    try {
      await enquiriesApi.submit({ ...enquiryForm, property_id: id });
      setEnquirySuccess('Enquiry submitted successfully!');
      setEnquiryForm((prev) => ({ ...prev, message: '', phone: '' }));
    } catch (err) {
      setEnquiryError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="loading">Loading property...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!property) return <p className="empty">Property not found.</p>;

  const isOwner = isAgent && user?.id === property.agent_id;

  return (
    <div className="page detail-page">
      <Link to="/" className="back-link">
        &larr; Back to listings
      </Link>

      <article className="detail-card">
        <div className="detail-card-header">
          <div>
            <h1>{property.title}</h1>
            <p className="detail-location">{property.location}</p>
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
          <span>{property.bhk} BHK</span>
          <span className="detail-price">{formatPrice(property.price)}</span>
        </div>
        <p className="detail-description">{property.description}</p>
      </article>

      {!isOwner && (
        <section className="enquiry-section">
          <h2>Submit an enquiry</h2>
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
                value={enquiryForm.message}
                onChange={(e) =>
                  setEnquiryForm({ ...enquiryForm, message: e.target.value })
                }
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Submit enquiry'}
            </button>
          </form>
        </section>
      )}

      {isOwner && (
        <section className="enquiries-list">
          <h2>Enquiries ({enquiries.length})</h2>
          {enquiries.length === 0 ? (
            <p className="empty">No enquiries yet.</p>
          ) : (
            <ul>
              {enquiries.map((enquiry) => (
                <li key={enquiry.id} className="enquiry-item">
                  <strong>{enquiry.name}</strong> — {enquiry.email},{' '}
                  {enquiry.phone}
                  <p>{enquiry.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
