import type { Profile } from "../api/profiles";

export function createProfileDetails(profile: Profile): string {
  const avatar =
    profile.avatar?.url || "https://placehold.co/200x200?text=No+avatar";

  const banner =
    profile.banner?.url || "https://placehold.co/1200x300?text=No+banner";

  const bio = profile.bio || "No bio added yet.";

  const listingsHtml = profile.listings?.length
    ? profile.listings
        .map(
          (listing) => `
            <article>
              <h3>${listing.title}</h3>
              <p>${listing.description || "No description available."}</p>
            </article>
          `,
        )
        .join("")
    : `<p>No listings yet.</p>`;

  const winsHtml = profile.wins?.length
    ? profile.wins
        .map(
          (listing) => `
            <article>
              <h3>${listing.title}</h3>
              <p>${listing.description || "No description available."}</p>
            </article>
          `,
        )
        .join("")
    : `<p>No wins yet.</p>`;

  return `
    <section>
      <div>
        <img src="${banner}" alt="${profile.banner?.alt || profile.name}" />
      </div>

      <div>
        <img src="${avatar}" alt="${profile.avatar?.alt || profile.name}" />
        <h1>${profile.name}</h1>
        <p>${profile.email}</p>
        <p>${bio}</p>
        <p>Credits: ${profile.credits}</p>
        <p>Listings: ${profile._count?.listings ?? 0}</p>
        <p>Wins: ${profile._count?.wins ?? 0}</p>
      </div>

      <div>
        <h2>My listings</h2>
        ${listingsHtml}
      </div>

      <div>
        <h2>My wins</h2>
        ${winsHtml}
      </div>
    </section>
  `;
}
