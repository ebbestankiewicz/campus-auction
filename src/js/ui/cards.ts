import type { Listing } from "../api/listings";

const fallbackImage = "https://placehold.co/600x400?text=No+image";

export function createListingCard(listing: Listing): string {
  const image = listing.media?.[0]?.url || fallbackImage;
  const alt = listing.media?.[0]?.alt || listing.title;

  return `
    <article class="card">
      <img src="${image}" alt="${alt}" class="card__image" />
      <div class="card__content">
        <h2 class="card__title">${listing.title}</h2>
        <p class="card__description">
          ${listing.description || "No description available."}
        </p>
        <p class="card__bids">Bids: ${listing._count?.bids ?? 0}</p>
        <p class="card__ends">Ends: ${new Date(listing.endsAt).toLocaleString()}</p>
      </div>
    </article>
  `;
}
