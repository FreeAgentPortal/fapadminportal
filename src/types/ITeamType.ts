import User from "./User";

export interface TeamMember {
  user: User;
  role: string;
}

export interface ITeamType {
  _id: string;
  name: string;
  email?: string;
  coachName?: string;
  league?: string;
  phone?: string;
  slug?: string; // Optional slug for URL-friendly team name
  abbreviation?: string; // e.g., "SF" for San Francisco 49ers
  shortDisplayName?: string; // e.g., "49ers"
  positionsNeeded?: string[]; // e.g., ["QB", "WR", "OL"]
  color: string; // e.g., "#AA0000" for team color
  alternateColor?: string; // e.g., "#FFFFFF" for alternate color
  isActive?: boolean; // Whether the team is currently active
  isAllStar?: boolean; // Whether the team is an All-Star team
  logoUrl?: string; // URL for the team's logo
  logos?: [{ href: string; alt: string; width: number; height: number }]; // Array of logo objects with href and alt text
  links?: [{ language: string; href: string; text: string; shortText: string }];
  location: string; // e.g., "CA", "TX"
  linkedUsers: TeamMember[]; // References to users with access
  alertsEnabled: boolean;
  verifiedDomain?: string; // e.g., "example.edu"
  claimToken?: string; // Token for claiming the team
  claimTokenExpiresAt?: Date; // Expiration date for the claim token
  openToTryouts?: boolean; // Whether the team is open to new athletes
  createdAt: Date;
  updatedAt: Date;
}
