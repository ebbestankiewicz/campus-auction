import type { Listing } from "../api/listings";
import { isLoggedIn } from "../utils/storage";

export function createListingDetails(listing: Listing): string {
  const image =
    listing.media?.[0]?.url || "https://placehold.co/1200x800?text=No+image";
  const alt = listing.media?.[0]?.alt || listing.title;

  const sellerName = listing.seller?.name || "Unknown seller";
  const highestBid = listing.bids?.length
    ? Math.max(...listing.bids.map((bid) => bid.amount))
    : 0;

  const bidsHtml = listing.bids?.length
    ? listing.bids
        .sort((a, b) => b.amount - a.amount)
        .map(
          (bid) => `
            <li class="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4">
              <span class="text-slate-300">${bid.bidder.name}</span>
              <span class="font-semibold text-purple-300">${bid.amount} credits</span>
            </li>
          `,
        )
        .join("")
    : `<li class="rounded-xl border border-slate-800 bg-slate-900 p-4 text-slate-400">No bids yet</li>`;

  const bidSection = isLoggedIn()
    ? `
      <form id="bidForm" class="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <label for="bidAmount" class="mb-2 block text-sm font-medium text-slate-300">
          Place bid
        </label>

        <div class="flex flex-col gap-3 sm:flex-row">
          <input
            id="bidAmount"
            type="number"
            min="${highestBid + 1}"
            placeholder="Minimum ${highestBid + 1}"
            class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-purple-500"
            required
          />

          <button
            type="submit"
            class="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Place bid
          </button>
        </div>

        <p id="bidMessage" class="mt-3 hidden rounded-xl p-3 text-sm"></p>
      </form>
    `
    : `
      <div class="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p class="text-slate-300">Log in to place a bid.</p>
        <a href="/login.html" class="mt-3 inline-flex rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700">
          Login
        </a>
      </div>
    `;

  return `
    <section class="mx-auto max-w-5xl space-y-8 text-white">
      <article class="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-xl">
        <img src="${image}" alt="${alt}" class="h-72 w-full object-cover sm:h-96" />

        <div class="space-y-6 p-6">
          <div>
            <h1 class="text-3xl font-bold">${listing.title}</h1>
            <p class="mt-2 text-slate-400">${listing.description || "No description available."}</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            <div class="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <p class="text-sm text-slate-400">Seller</p>
              <p class="font-semibold">${sellerName}</p>
            </div>

            <div class="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <p class="text-sm text-slate-400">Highest bid</p>
              <p class="font-semibold text-purple-300">${highestBid} credits</p>
            </div>

            <div class="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <p class="text-sm text-slate-400">Ends</p>
              <p class="font-semibold">${new Date(listing.endsAt).toLocaleString()}</p>
            </div>
          </div>

          ${bidSection}
        </div>
      </article>

      <section>
        <h2 class="mb-4 text-2xl font-bold">Bid history</h2>
        <ul class="space-y-3">
          ${bidsHtml}
        </ul>
      </section>
    </section>
  `;
}
