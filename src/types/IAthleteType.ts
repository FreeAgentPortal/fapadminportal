export interface IAthlete {
  _id: string;
  espnid?: string; // ESPN ID, optional for querying espn athlete data
  userId: string;
  fullName: string;
  contactNumber?: string;
  email?: string;
  birthPlace?: {
    city: string;
    state: string;
    country: string;
  };
  links?: {
    text: string;
    shortText: string;
    href: string;
    rel: string[];
    isExternal: boolean;
  }[];
  draft?: {
    year: number;
    round: number;
    pick: number;
    team: string; // Team name or ID
  };
  birthdate?: Date;
  measurements?: Map<string, string | number>; // e.g., "height": "6'1\""
  metrics?: Map<string, number>; // e.g., "dash40": 4.42
  college?: string;
  positions?: Array<{
    name: string;
    abbreviation: string;
  }>;
  graduationYear?: number;
  bio?: string;
  highSchool?: string;
  awards?: string[];
  strengths?: string;
  weaknesses?: string;
  experienceYears?: number; // Years of playing experience
  testimony?: string;
  profileImageUrl?: string;
  isActive?: boolean; // Whether the athlete is currently active
  highlightVideos?: string[]; // Max 5
  diamondRating?: number; // 1–5, assigned by scouts later
  createdAt: Date;
  updatedAt: Date;
}
