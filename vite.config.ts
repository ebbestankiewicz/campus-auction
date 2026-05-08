import { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        listing: resolve(__dirname, "listing.html"),
        login: resolve(__dirname, "login.html"),
        register: resolve(__dirname, "register.html"),
        profile: resolve(__dirname, "profile.html"),
        editProfile: resolve(__dirname, "edit-profile.html"),
        createListing: resolve(__dirname, "create-listing.html"),
        editListing: resolve(__dirname, "edit-listing.html"),
      },
    },
  },
});
