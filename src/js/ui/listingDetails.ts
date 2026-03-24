import type { Listing } from "../api/listings";

export function createListingDetails(listing: Listing): string {
  const image =
    listing.media?.[0]?.url || "https://placehold.co/1200x800?text=No+image";

  const alt = listing.media?.[0]?.alt || listing.title;

  return `
    <article class="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-md">
      <div class="grid gap-8 md:grid-cols-2">
        <div class="h-80 bg-gray-200 md:h-full">
          <img
            src="${image}"
            alt="${alt}"
            class="h-full w-full object-cover"
          />
        </div>

        <div class="flex flex-col justify-between p-6">
          <div>
            <h1 class="mb-4 text-3xl font-semibold">${listing.title}</h1>
            <p class="mb-6 text-slate-300">
              ${listing.description || "No description available."}
            </p>
          </div>

          <div class="space-y-3">
            <p>Bids: ${listing._count?.bids ?? 0}</p>
            <p>Ends: ${new Date(listing.endsAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </article>
  `;
}
