import type { CreateEnquiryInput, Enquiry } from '../types';
import { api } from './client';

export const enquiriesApi = {
  submit: (data: CreateEnquiryInput) =>
    api.post<Enquiry>('/v1/enquiries', data),

  listForProperty: (propertyId: string) =>
    api.authGet<Enquiry[]>(`/v1/enquiries/property/${propertyId}`),
};
