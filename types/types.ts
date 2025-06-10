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

export interface CreateCityData {
  name: string;
}

export interface UpdateCityData {
  name: string;
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

export interface CityType {
  id: number;
  name: string;
}

export interface DestinationImageType {
  id: number;
  image_url: string;
}

export interface DestinationType {
  id: number;
  city_id: number;
  destination_name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  entry_fee: number;
  operational_hours: string;
  images: DestinationImageType[] | [];
  rating: number;
  review_count: number;
  city: CityType;
}

export interface CreateDestinationData {
  city_id: number;
  destination_name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  entry_fee: number;
  operational_hours: string;
}

export interface UpdateDestinationData {
  city_id: number | null;
  destination_name: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  entry_fee: number | null;
  operational_hours: string | null;
}