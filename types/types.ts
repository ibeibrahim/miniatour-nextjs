export interface UserType {
  id: number;
  role_id: number;
  name: string;
  email: string;
  photo_url: string | null;
  fcm_token: string | null;
  tourguide_id: string | null;
  city_id: string | null;
  description: string | null;
  is_active: number | null;
  price: string | null;
}

export interface CreateUserData {
  role_id: string;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  photo_profile: File | null;
  city_id: string | null;
  description: string | null;
  is_active: number | null;
  price: string | null;
}

export interface UpdateUserData {
  name: string | null;
  email: string | null;
  photo_profile: File | null;
  city_id: string | null;
  description: string | null;
  is_active: number | null;
  price: string | null;
}

export interface City {
  id: number;
  name: string;
}