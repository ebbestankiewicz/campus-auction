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
            <li>
              <span>${bid.bidder.name}</span>
              <span>${bid.amount}</span>
            </li>
          `,
        )
        .join("")
    : `<li>No bids yet</li>`;

  return `
    <article>
      <div>
        <div>
          <img src="${image}" alt="${alt}" />
        </div>

        <div>
          <div>
            <h1>${listing.title}</h1>
            <p>
              ${listing.description || "No description available."}
            </p>
          </div>

          <div>
            <h2>Seller</h2>
            <p>Name: ${sellerName}</p>
            <p>Email: ${sellerEmail}</p>
          </div>

          <div>
            <h2>Auction info</h2>
            <p>Total bids: ${listing._count?.bids ?? 0}</p>
            <p>Highest bid: ${highestBid}</p>
            <p>Ends: ${new Date(listing.endsAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div>
        <h2>Bid history</h2>
        <ul>
          ${bidsHtml}
        </ul>
      </div>
    </article>
  `;
}
