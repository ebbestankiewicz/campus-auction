import type { Listing } from "../api/listings";

const fallbackImage = "https://placehold.co/600x400?text=No+image";

export function createListingCard(listing: Listing): string {
  const image = listing.media?.[0]?.url || fallbackImage;
  const alt = listing.media?.[0]?.alt || listing.title;

  return `
    <a href="/listing.html?id=${listing.id}" class="block group">
      <article class="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-md transition hover:-translate-y-1 hover:border-primary hover:shadow-xl">
        
        <div class="h-56 w-full overflow-hidden">
          <img 
            src="${image}" 
            alt="${alt}" 
            class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        <div class="flex flex-1 flex-col justify-between p-5">
          
          <div>
            <h2 class="mb-2 line-clamp-1 text-lg font-semibold text-text">
              ${listing.title}
            </h2>

            <p class="line-clamp-2 text-sm text-muted">
              ${listing.description || "No description available."}
            </p>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <p class="text-xs text-muted">
              Bids: ${listing._count?.bids ?? 0}
            </p>

            <span class="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-text">
              Ends: ${new Date(listing.endsAt).toLocaleDateString()}
            </span>
          </div>

        </div>
      </article>
    </a>
  `;
}
