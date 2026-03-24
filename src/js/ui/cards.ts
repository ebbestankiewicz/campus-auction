import type { Listing } from "../api/listings";

const fallbackImage = "https://placehold.co/600x400?text=No+image";

export function createListingCard(listing: Listing): string {
  const image = listing.media?.[0]?.url || fallbackImage;
  const alt = listing.media?.[0]?.alt || listing.title;

  return `
  <a href="/listings/${listing.id}" class="block">
      <article class="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-md">
      <div class="h-72 w-full bg-gray-200">
          <img 
            src="${image}" 
            alt="${alt}" 
            class="h-full w-full object-cover" />
        </div>
        <div class="flex min-h-[220px] flex-col justify-between bg-slate-800 p-6 text-white">
          <div>
            <h2 class="mb-3 text-2xl font-semibold leading-tight">
            ${listing.title}</h2>
            <p class="text-base leading-snug text-slate-300 line-clamp-2">
              ${listing.description || "No description available."}
            </p>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <p class="text-sm">Bids: ${listing._count?.bids ?? 0}</p>
            <p class="rounded-full bg-violet-500 px-4 py-2 text-xs font-semibold text-white">
            Ends: ${new Date(listing.endsAt).toLocaleString()}</p>
          </div>
        </div>
      </article>
    </a>
  `;
}
