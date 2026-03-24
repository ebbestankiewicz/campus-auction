import type { Listing } from "../api/listings";

export function createListingDetails(listing: Listing): string {
  const image =
    listing.media?.[0]?.url || "https://placehold.co/1200x800?text=No+image";

  const alt = listing.media?.[0]?.alt || listing.title;

  const sellerName = listing.seller?.name || "Unknown seller";
  const sellerEmail = listing.seller?.email || "No email available";

  const highestBid = listing.bids?.length
    ? Math.max(...listing.bids.map((bid) => bid.amount))
    : 0;

  const bidsHtml = listing.bids?.length
    ? listing.bids
        .map(
          (bid) => `
            <li class="border rounded-lg mt-4 p-4 flex justify-between">
              <span>${bid.bidder.name}</span>
              <span>${bid.amount}</span>
            </li>
          `,
        )
        .join("")
    : `<li>No bids yet</li>`;

  return `
    <article class="mx-auto max-w-[800px] p-6 text-white border border-slate-700 shadow-md">
      <div>
        <div>
          <img src="${image}" alt="${alt}" class="rounded-2xl border border-slate-600 bg-white" />
        </div>

        <div>
          <div class="mt-6">
            <h1 class="text-2xl font-bold">${listing.title}</h1>
            <p class="mt-4 text-sm">
              ${listing.description || "No description available."}
            </p>
          </div>

          <div class="mt-6">
            <h2 class="text-xl font-semibold">Seller</h2>
            <div class=" border p-4 rounded-lg mt-2">
                <p>Name: ${sellerName}</p>
                <p>Email: ${sellerEmail}</p>
            </div>
          </div>

          <div class="mt-6">
            <h2 class="text-xl font-semibold">Auction info</h2>
            <div class=" border p-4 rounded-lg mt-2">
              <p>Total bids: ${listing._count?.bids ?? 0}</p>
              <p>Highest bid: ${highestBid}</p>
              <p>Ends: ${new Date(listing.endsAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <h2 class="text-xl font-semibold">Bid history</h2>
        <ul>
          ${bidsHtml}
        </ul>
      </div>
    </article>
  `;
}
