import { fetchWithAuth } from "./fetchWithAuth";

export type ProfileListing = {
  id: string;
  title: string;
  description: string;
  media: { url: string; alt?: string }[];
  tags: string[];
  created: string;
  updated: string;
  endsAt: string;
};

export type Profile = {
  name: string;
  email: string;
  bio: string;
  avatar?: { url: string; alt?: string };
  banner?: { url: string; alt?: string };
  credits: number;
  listings?: ProfileListing[];
  wins?: ProfileListing[];
  _count?: {
    listings: number;
    wins: number;
  };
};

type ProfileResponse = {
  data: Profile;
};

export type UpdateProfileData = {
  bio?: string;
  avatar?: {
    url: string;
    alt?: string;
  };
  banner?: {
    url: string;
    alt?: string;
  };
};

export async function getProfile(name: string): Promise<Profile> {
  const response = await fetchWithAuth(
    `/auction/profiles/${name}?_listings=true&_wins=true`,
  );

  const json: ProfileResponse = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return json.data;
}

export async function updateProfile(
  name: string,
  data: UpdateProfileData,
): Promise<Profile> {
  const response = await fetchWithAuth(`/auction/profiles/${name}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const json: ProfileResponse = await response.json();

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return json.data;
}
