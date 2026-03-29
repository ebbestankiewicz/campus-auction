import { fetchWithAuth } from "./fetchWithAuth";

type CreateListingData = {
  title: string;
  description: string;
  tags: string[];
};

export async function createListing(data: CreateListingData) {
  const response = await fetchWithAuth("/auction/listings", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to create listing");
  }

  return json.data;
}
