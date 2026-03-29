import "../../css/main.css";
import { getListings } from "../api/listings";
import type { Listing } from "../api/listings";
import { createListingCard } from "../ui/cards";
import { renderNavbar } from "../ui/navbar";

let allListings: Listing[] = [];

function renderListings(listings: Listing[]): void {
  const container = document.querySelector<HTMLElement>("#listings");

  if (!container) return;

  container.innerHTML = listings.map(createListingCard).join("");
}

function populateTagFilter(listings: Listing[]): void {
  const tagFilter = document.querySelector<HTMLSelectElement>("#tagFilter");

  if (!tagFilter) return;

  const uniqueTags = [
    ...new Set(listings.flatMap((listing) => listing.tags || [])),
  ];

  tagFilter.innerHTML = `
    <option value="">All categories</option>
    ${uniqueTags.map((tag) => `<option value="${tag}">${tag}</option>`).join("")}
  `;
}

function applyFilters(): void {
  const input = document.querySelector<HTMLInputElement>("#searchInput");
  const tagFilter = document.querySelector<HTMLSelectElement>("#tagFilter");
  const sortSelect = document.querySelector<HTMLSelectElement>("#sortSelect");
  const noResults = document.querySelector<HTMLElement>("#noResults");
  const clearBtn = document.querySelector<HTMLButtonElement>("#clearSearch");

  if (!input) return;

  const searchValue = input.value.toLowerCase().trim();
  const selectedTag = tagFilter?.value || "";
  const sortValue = sortSelect?.value || "endingSoon";

  let filteredListings = [...allListings];

  filteredListings = filteredListings.filter((listing) => {
    const title = listing.title.toLowerCase();
    const description = listing.description?.toLowerCase() || "";

    const matchesSearch =
      title.includes(searchValue) || description.includes(searchValue);

    const matchesTag =
      selectedTag === "" || listing.tags?.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  filteredListings.sort((a, b) => {
    if (sortValue === "newest") {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    }

    return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
  });

  renderListings(filteredListings);

  if (noResults) {
    noResults.classList.toggle("hidden", filteredListings.length > 0);
  }

  if (clearBtn) {
    clearBtn.classList.toggle("hidden", input.value.length === 0);
  }
}

function setupSearchAndFilter(): void {
  const input = document.querySelector<HTMLInputElement>("#searchInput");
  const tagFilter = document.querySelector<HTMLSelectElement>("#tagFilter");
  const sortSelect = document.querySelector<HTMLSelectElement>("#sortSelect");
  const clearBtn = document.querySelector<HTMLButtonElement>("#clearSearch");
  const noResults = document.querySelector<HTMLElement>("#noResults");

  if (!input || !clearBtn) return;

  input.addEventListener("input", applyFilters);

  tagFilter?.addEventListener("change", applyFilters);
  sortSelect?.addEventListener("change", applyFilters);

  clearBtn.addEventListener("click", () => {
    input.value = "";

    if (tagFilter) {
      tagFilter.value = "";
    }

    if (sortSelect) {
      sortSelect.value = "endingSoon";
    }

    noResults?.classList.add("hidden");
    clearBtn.classList.add("hidden");

    applyFilters();
    input.focus();
  });
}

async function loadListings(): Promise<void> {
  const container = document.querySelector<HTMLElement>("#listings");

  if (!container) return;

  try {
    const listings = await getListings();
    allListings = listings;

    populateTagFilter(allListings);
    applyFilters();
  } catch (error) {
    console.error(error);
    container.innerHTML = `<p>Failed to load listings.</p>`;
  }
}

function initHomePage(): void {
  renderNavbar();
  setupSearchAndFilter();
  loadListings();
}

initHomePage();
