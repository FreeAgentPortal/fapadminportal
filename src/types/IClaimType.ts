export interface IClaimType {
  _id: string;
  user: string; // Reference to User
  profile: string; // Profile type (e.g., athlete, team, agent, scout)
  slug?: string; // Optional slug for the claim
  claimType: string; // Type of claim (e.g., 'athlete', 'team', etc.)
  message?: string; // Optional message for the claim, e.g., reason for approval or denial
  status: 'pending' | 'not started' | 'approved' | 'denied'; // Status of the claim (e.g., 'pending', 'approved', 'rejected')
  documents?: [{ url: string; fileName: string; type: string }]; // Array of documents associated with the claim
  createdAt?: Date;
  updatedAt?: Date;
}