import "../../css/main.css";
import { getListings } from "../api/listings";
import { createListingCard } from "../ui/cards";
import { renderNavbar } from "../ui/navbar";
import type { Listing } from "../api/listings";

let allListings: Listing[] = [];

async function loadListings() {
  const container = document.querySelector("#listings");

  if (!container) return;

  try {
    const listings = await getListings();
    allListings = listings;

    container.innerHTML = listings.map(createListingCard).join("");
  } catch (error) {
    console.error(error);
    container.innerHTML = `<p>Failed to load listings.</p>`;
  }
}

function setupSearch() {
  const input = document.querySelector<HTMLInputElement>("#searchInput");
  const container = document.querySelector("#listings");
  const noResults = document.querySelector("#noResults");
  const clearBtn = document.querySelector<HTMLButtonElement>("#clearSearch");

  if (!input || !container || !clearBtn) return;

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase().trim();

    const filtered = allListings.filter((listing) => {
      const title = listing.title.toLowerCase();
      const description = listing.description?.toLowerCase() || "";

      return title.includes(value) || description.includes(value);
    });

    container.innerHTML = filtered.map(createListingCard).join("");

    if (noResults) {
      noResults.classList.toggle("hidden", filtered.length > 0);
    }

    clearBtn.classList.toggle("hidden", input.value.length === 0);
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    container.innerHTML = allListings.map(createListingCard).join("");

    noResults?.classList.add("hidden");
    clearBtn.classList.add("hidden");

    input.focus();
  });
}

renderNavbar();
loadListings();
setupSearch();
