import type {
  CreatePropertyInput,
  Property,
  PropertyFilters,
} from '../types';
import { api } from './client';

function buildQuery(filters: PropertyFilters): string {
  const params = new URLSearchParams();
  if (filters.location) params.set('location', filters.location);
  if (filters.bhk) params.set('bhk', filters.bhk);
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  const query = params.toString();
  return query ? `?${query}` : '';
}

export const propertiesApi = {
  list: (filters: PropertyFilters = {}) =>
    api.get<Property[]>(`/v1/properties${buildQuery(filters)}`),

  getById: (id: string) => api.get<Property>(`/v1/properties/${id}`),

  mine: () => api.authGet<Property[]>('/v1/properties/mine'),

  create: (data: CreatePropertyInput) =>
    api.authPost<Property>('/v1/properties', data),

  update: (id: string, data: Partial<CreatePropertyInput>) =>
    api.authPut<Property>(`/v1/properties/${id}`, data),

  remove: (id: string) => api.authDelete<null>(`/v1/properties/${id}`),
};
