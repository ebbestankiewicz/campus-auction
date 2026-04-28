import type { Listing } from "../api/listings";
import { getUser, isLoggedIn } from "../utils/storage";

export function createListingDetails(listing: Listing): string {
  const image =
    listing.media?.[0]?.url || "https://placehold.co/1200x800?text=No+image";
  const alt = listing.media?.[0]?.alt || listing.title;

  const sellerName = listing.seller?.name || "Unknown seller";
  const highestBid = listing.bids?.length
    ? Math.max(...listing.bids.map((bid) => bid.amount))
    : 0;

  const user = getUser();
  const isOwner = user?.name === listing.seller?.name;

  const ownerActions = isOwner
    ? `
      <div class="mt-4 flex gap-3">
        <a
          href="/edit-listing.html?id=${listing.id}"
          class="rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary-muted transition hover:bg-primary hover:text-text"
        >
          Edit
        </a>

        <button
          id="deleteListingBtn"
          type="button"
          class="rounded-xl border border-danger px-4 py-2 text-sm font-semibold text-danger-muted transition hover:bg-danger hover:text-text"
        >
          Delete
        </button>
      </div>
    `
    : "";

  const bidsHtml = listing.bids?.length
    ? listing.bids
        .sort((a, b) => b.amount - a.amount)
        .map(
          (bid) => `
            <li class="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
              <span class="text-muted">${bid.bidder.name}</span>
              <span class="font-semibold text-primary-muted">${bid.amount} credits</span>
            </li>
          `,
        )
        .join("")
    : `<li class="rounded-xl border border-border bg-surface p-4 text-muted">No bids yet</li>`;

  const bidSection =
    isLoggedIn() && !isOwner
      ? `
        <form id="bidForm" class="mt-6 rounded-2xl border border-border bg-surface p-5">
          <label for="bidAmount" class="mb-2 block text-sm font-medium text-muted">
            Place bid
          </label>

          <div class="flex flex-col gap-3 sm:flex-row">
            <input
              id="bidAmount"
              type="number"
              min="${highestBid + 1}"
              placeholder="Minimum ${highestBid + 1}"
              class="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text outline-none placeholder:text-muted focus:border-primary"
              required
            />

            <button
              type="submit"
              class="rounded-xl bg-primary px-5 py-3 font-semibold text-text transition hover:bg-primary-hover"
            >
              Place bid
            </button>
          </div>

          <p id="bidMessage" class="mt-3 hidden rounded-xl p-3 text-sm"></p>
        </form>
      `
      : isOwner
        ? `
          <div class="mt-6 rounded-2xl border border-border bg-surface p-5 text-muted">
            You cannot bid on your own listing.
          </div>
        `
        : `
          <div class="mt-6 rounded-2xl border border-border bg-surface p-5">
            <p class="text-muted">Log in to place a bid.</p>
            <a href="/login.html" class="mt-3 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-text transition hover:bg-primary-hover">
              Login
            </a>
          </div>
        `;

  return `
    <section class="mx-auto max-w-5xl space-y-8 text-text">
      <article class="overflow-hidden rounded-3xl border border-border bg-surface shadow-xl">
        <img src="${image}" alt="${alt}" class="h-72 w-full object-cover sm:h-96" />

        <div class="space-y-6 p-6">
          <div>
            <p class="mb-2 text-sm text-muted">Listed by ${sellerName}</p>
            <h1 class="text-3xl font-bold">${listing.title}</h1>
            <p class="mt-2 text-muted">
              ${listing.description || "No description available."}
            </p>

            ${ownerActions}
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            <div class="rounded-2xl border border-border bg-bg p-4">
              <p class="text-sm text-muted">Seller</p>
              <p class="font-semibold">${sellerName}</p>
            </div>

            <div class="rounded-2xl border border-border bg-bg p-4">
              <p class="text-sm text-muted">Highest bid</p>
              <p class="font-semibold text-primary-muted">${highestBid} credits</p>
            </div>

            <div class="rounded-2xl border border-border bg-bg p-4">
              <p class="text-sm text-muted">Ends</p>
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
