import "../../css/main.css";
import { getListings } from "../api/listings";
import { createListingCard } from "../ui/cards";
import { renderNavbar } from "../ui/navbar";

renderNavbar();

async function loadListings() {
  const listingsContainer = document.querySelector<HTMLDivElement>("#listings");

  if (!listingsContainer) {
    throw new Error("Could not find #listings in the DOM");
  }

  try {
    const listings = await getListings();

    listingsContainer.innerHTML = listings.map(createListingCard).join("");
  } catch (error) {
    console.error(error);
    listingsContainer.innerHTML = `<p>Failed to load listings.</p>`;
  }
}

loadListings();
