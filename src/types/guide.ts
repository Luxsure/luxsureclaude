export interface Place {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  zip: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  instagram: string | null;
  price_range: number | null;
  description: string | null;
  is_published: boolean;
  created_at: string;
}

export interface GuidePage {
  places: Place[];
  total: number;
  page: number;
  perPage: number;
}

export interface GuideFiltersState {
  category?: string;
  city?: string;
  country?: string;
  search?: string;
  page?: number;
}
