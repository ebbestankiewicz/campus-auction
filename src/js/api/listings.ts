import { BASE_URL } from "./constants";
import { fetchWithAuth } from "./fetchWithAuth";

export type Listing = {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  media: {
    url: string;
    alt?: string;
  }[];
  created: string;
  endsAt: string;
  _count: {
    bids: number;
  };
  seller?: {
    name: string;
    email: string;
    avatar?: { url: string };
  };
  bids?: {
    id: string;
    amount: number;
    bidder: {
      name: string;
      email: string;
      avatar?: {
        url: string;
        alt?: string;
      };
    };
  }[];
};

type ListingsResponse = {
  data: Listing[];
};

type ListingResponse = {
  data: Listing;
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
  const response = await fetch(
    `${BASE_URL}/auction/listings/${id}?_seller=true&_bids=true`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch listing: ${response.status}`);
  }

  const json: ListingResponse = await response.json();
  return json.data;
}

type BidResponse = {
  data: Listing;
};

export async function placeBid(
  listingId: string,
  amount: number,
): Promise<Listing> {
  const response = await fetchWithAuth(`/auction/listings/${listingId}/bids`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });

  const json = await response.json();

  if (!response.ok) {
    console.error("Bid API error:", json);
    throw new Error(json.errors?.[0]?.message || "Failed to place bid");
  }

  return json.data;
}

export type CreateListingData = {
  title: string;
  description?: string;
  tags?: string[];
  media?: {
    url: string;
    alt?: string;
  }[];
  endsAt: string;
};

type CreateListingResponse = {
  data: Listing;
};

export async function createListing(data: CreateListingData): Promise<Listing> {
  const response = await fetchWithAuth("/auction/listings", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: CreateListingResponse = await response.json();

  if (!response.ok) {
    throw new Error("Failed to create listing");
  }

  return json.data;
}
