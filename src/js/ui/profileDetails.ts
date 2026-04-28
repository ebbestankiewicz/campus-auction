import type { Profile, ProfileListing } from "../api/profiles";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createMiniListingCard(listing: ProfileListing): string {
  const image =
    listing.media?.[0]?.url || "https://placehold.co/600x400?text=No+image";
  const alt = listing.media?.[0]?.alt || listing.title;

  return `
    <a href="/listing.html?id=${listing.id}" class="block overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg">
      <img src="${image}" alt="${escapeHtml(alt)}" class="h-40 w-full object-cover" />
      <div class="space-y-2 p-4">
        <h3 class="line-clamp-1 text-lg font-semibold text-text">${escapeHtml(listing.title)}</h3>
        <p class="line-clamp-2 text-sm text-muted">${escapeHtml(listing.description || "No description available.")}</p>
        <p class="text-xs text-muted-soft">Ends ${new Date(listing.endsAt).toLocaleDateString()}</p>
      </div>
    </a>
  `;
}

export function createProfileDetails(profile: Profile): string {
  const avatar =
    profile.avatar?.url || "https://placehold.co/200x200?text=Avatar";
  const avatarAlt = profile.avatar?.alt || `${profile.name}'s avatar`;

  const banner =
    profile.banner?.url || "https://placehold.co/1200x320?text=Profile+banner";
  const bannerAlt = profile.banner?.alt || `${profile.name}'s banner`;

  const bio = profile.bio || "No bio added yet.";

  const listingsHtml = profile.listings?.length
    ? profile.listings.map(createMiniListingCard).join("")
    : `<p class="rounded-xl border border-border bg-surface p-4 text-muted">No listings created yet.</p>`;

  const winsHtml = profile.wins?.length
    ? profile.wins.map(createMiniListingCard).join("")
    : `<p class="rounded-xl border border-border bg-surface p-4 text-muted">No wins yet.</p>`;

  return `
    <section class="space-y-8 text-text">
      
      <div class="overflow-hidden rounded-3xl border border-border bg-bg shadow-xl">
        <img src="${banner}" alt="${escapeHtml(bannerAlt)}" class="h-48 w-full object-cover sm:h-64" />

        <div class="relative px-6 pb-6">
          <img src="${avatar}" alt="${escapeHtml(avatarAlt)}" class="-mt-16 h-32 w-32 rounded-full border-4 border-bg object-cover shadow-lg" />

          <div class="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 class="text-3xl font-bold">${escapeHtml(profile.name)}</h1>
              <p class="text-sm text-muted">${escapeHtml(profile.email)}</p>
            </div>

            <a href="/edit-profile.html" class="inline-flex items-center justify-center rounded-xl border border-primary px-5 py-2 text-sm font-semibold text-primary-muted transition hover:bg-primary hover:text-text">
              Edit profile
            </a>
          </div>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <article class="rounded-2xl border border-border bg-surface p-5">
          <p class="text-sm text-muted">Credits</p>
          <p class="mt-1 text-2xl font-bold text-primary-muted">${profile.credits}</p>
        </article>

        <article class="rounded-2xl border border-border bg-surface p-5">
          <p class="text-sm text-muted">Listings</p>
          <p class="mt-1 text-2xl font-bold">
            ${profile._count?.listings ?? profile.listings?.length ?? 0}
          </p>
        </article>

        <article class="rounded-2xl border border-border bg-surface p-5">
          <p class="text-sm text-muted">Wins</p>
          <p class="mt-1 text-2xl font-bold">
            ${profile._count?.wins ?? profile.wins?.length ?? 0}
          </p>
        </article>
      </div>

      <article class="rounded-2xl border border-border bg-surface p-6">
        <h2 class="text-xl font-semibold">Bio</h2>
        <p class="mt-3 leading-relaxed text-muted">${escapeHtml(bio)}</p>
      </article>

      <section>
        <h2 class="mb-4 text-2xl font-bold">My listings</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          ${listingsHtml}
        </div>
      </section>

      <section>
        <h2 class="mb-4 text-2xl font-bold">My wins</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          ${winsHtml}
        </div>
      </section>

    </section>
  `;
}
