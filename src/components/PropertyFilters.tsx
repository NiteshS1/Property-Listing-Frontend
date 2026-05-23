import { type FormEvent } from 'react';
import type { PropertyFilters as Filters } from '../types';

interface PropertyFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onSubmit: () => void;
}

export function PropertyFiltersBar({
  filters,
  onChange,
  onSubmit,
}: PropertyFiltersProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const update = (field: keyof Filters, value: string) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <form className="filters" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Location"
        value={filters.location ?? ''}
        onChange={(e) => update('location', e.target.value)}
      />
      <input
        type="number"
        min={1}
        placeholder="BHK"
        value={filters.bhk ?? ''}
        onChange={(e) => update('bhk', e.target.value)}
      />
      <input
        type="number"
        min={0}
        placeholder="Min price"
        value={filters.minPrice ?? ''}
        onChange={(e) => update('minPrice', e.target.value)}
      />
      <input
        type="number"
        min={0}
        placeholder="Max price"
        value={filters.maxPrice ?? ''}
        onChange={(e) => update('maxPrice', e.target.value)}
      />
      <button type="submit" className="btn btn-primary">
        Search
      </button>
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() => {
          onChange({});
          onSubmit();
        }}
      >
        Clear
      </button>
    </form>
  );
}
