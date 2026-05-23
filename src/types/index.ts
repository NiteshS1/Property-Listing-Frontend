export type UserRole = 'agent' | 'home_seeker';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Property {
  id: string;
  agent_id: string;
  title: string;
  description: string;
  location: string;
  bhk: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Enquiry {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface PropertyFilters {
  location?: string;
  bhk?: string;
  minPrice?: string;
  maxPrice?: string;
}

export interface CreatePropertyInput {
  title: string;
  description: string;
  location: string;
  bhk: number;
  price: number;
}

export interface CreateEnquiryInput {
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface SignupInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}
