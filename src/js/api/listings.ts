const BASE_URL = "https://v2.api.noroff.dev";

export type Listing = {
  id: string;
  title: string;
  description: string;
  media: {
    url: string;
    alt?: string;
  }[];
  endsAt: string;
  _count: {
    bids: number;
  };
};

type ListingsResponse = {
  data: Listing[];
};

export async function getListings(): Promise<Listing[]> {
  const response = await fetch(`${BASE_URL}/auction/listings`);

  if (!response.ok) {
    throw new Error(`Failed to fetch listings: ${response.status}`);
  }

  const json: ListingsResponse = await response.json();
  return json.data;
}

export async function getListingById(id: string): Promise<Listing> {
  const response = await fetch(`${BASE_URL}/auction/listings/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch listing: ${response.status}`);
  }

  const json: ListingResponse = await response.json();
  return json.data;
}
