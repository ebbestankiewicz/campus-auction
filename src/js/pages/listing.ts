import "../../css/main.css";
import { getListingById } from "../api/listings";
import { createListingDetails } from "../ui/listingDetails";

async function loadListing() {
  const listingContainer = document.querySelector<HTMLElement>("#listing");

  if (!listingContainer) {
    throw new Error("Could not find #listing in the DOM");
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    listingContainer.innerHTML = `<p>Listing ID is missing.</p>`;
    return;
  }

  try {
    const listing = await getListingById(id);
    listingContainer.innerHTML = createListingDetails(listing);
  } catch (error) {
    console.error(error);
    listingContainer.innerHTML = `<p>Failed to load listing.</p>`;
  }
}

loadListing();
