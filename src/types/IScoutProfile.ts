import User from "./User";

export interface IScoutProfile {
  _id: string; // Unique identifier for the scout profile
  userId: User; // User ID of the scout
  user: User; // User object containing scout's details
  fullName: string; // Full name of the scout
  contactNumber?: string; // Contact number of the scout
  email?: string; // Email address of the scout
  bio?: string; // Short biography or description of the scout
  profileImageUrl?: string; // URL to the scout's profile image
  teams?: string[]; // Teams associated with the scout
  sports?: string[]; // Sports that the scout specializes in
  leagues?: string[]; // Leagues that the scout covers
  createdAt: Date; // Timestamp when the profile was created
  updatedAt: Date; // Timestamp when the profile was last updated
}