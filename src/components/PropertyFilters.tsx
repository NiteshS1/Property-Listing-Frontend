import { type FormEvent } from 'react';
import type { PropertyFilters as Filters } from '../types';

const BHK_OPTIONS = [1, 2, 3, 4, 5] as const;

interface PropertyFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onSubmit: (activeFilters?: Filters) => void;
}

export function PropertyFiltersBar({
  filters,
  onChange,
  onSubmit,
}: PropertyFiltersProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filters);
  };

  const update = (field: keyof Filters, value: string) => {
    onChange({ ...filters, [field]: value || undefined });
  };

  const selectedBhk = filters.bhk ?? '';

  const toggleBhk = (bhk: number) => {
    const value = String(bhk);
    onChange({
      ...filters,
      bhk: selectedBhk === value ? undefined : value,
    });
  };

  const handleClear = () => {
    onChange({});
    onSubmit({});
  };

  return (
    <form className="filters" onSubmit={handleSubmit}>
      <div className="filters-grid">
        <label className="filter-field">
          <span className="filter-label">Location</span>
          <input
            type="text"
            placeholder="e.g. Mumbai, Pune"
            value={filters.location ?? ''}
            onChange={(e) => update('location', e.target.value)}
          />
        </label>
        <label className="filter-field">
          <span className="filter-label">Min price (₹)</span>
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) => update('minPrice', e.target.value)}
          />
        </label>
        <label className="filter-field">
          <span className="filter-label">Max price (₹)</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) => update('maxPrice', e.target.value)}
          />
        </label>
      </div>

      <fieldset className="filter-bhk">
        <legend className="filter-label">Configuration</legend>
        <div className="filter-chips">
          {BHK_OPTIONS.map((bhk) => (
            <button
              key={bhk}
              type="button"
              className={`filter-chip${selectedBhk === String(bhk) ? ' filter-chip--active' : ''}`}
              onClick={() => toggleBhk(bhk)}
            >
              {bhk} BHK
            </button>
          ))}
        </div>
      </fieldset>

      <div className="filters-actions">
        <button type="submit" className="btn btn-primary">
          Search properties
        </button>
        <button type="button" className="btn btn-ghost" onClick={handleClear}>
          Clear filters
        </button>
      </div>
    </form>
  );
}
