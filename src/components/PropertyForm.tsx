import { type FormEvent, useState } from 'react';
import type { CreatePropertyInput } from '../types';

export interface PropertyFormValues {
  title: string;
  description: string;
  location: string;
  bhk: string;
  price: string;
}

interface PropertyFormProps {
  initialValues: PropertyFormValues;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (values: CreatePropertyInput) => Promise<void>;
}

export function PropertyForm({
  initialValues,
  submitLabel,
  submittingLabel,
  onSubmit,
}: PropertyFormProps) {
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({
        title: form.title,
        description: form.description,
        location: form.location,
        bhk: Number(form.bhk),
        price: Number(form.price),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form form-card">
        <label>
          Title
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </label>
        <label>
          Description
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </label>
        <label>
          Location
          <input
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </label>
        <div className="form-row">
          <label>
            BHK
            <input
              type="number"
              min={1}
              required
              value={form.bhk}
              onChange={(e) => setForm({ ...form, bhk: e.target.value })}
            />
          </label>
          <label>
            Price (INR)
            <input
              type="number"
              min={0}
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </label>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? submittingLabel : submitLabel}
        </button>
      </form>
    </>
  );
}

export const emptyPropertyForm: PropertyFormValues = {
  title: '',
  description: '',
  location: '',
  bhk: '',
  price: '',
};
