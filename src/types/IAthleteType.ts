export interface IAthlete {
  graduationYear: any;
  _id: string;
  userId: string;
  fullName: string;
  contactNumber: string;
  email: string;
  hometown?: string;
  birthdate?: Date;
  measurements?: Map<string, string>; // e.g., "height": "6'1\""
  metrics?: Map<string, number>; // e.g., "dash40": 4.42
  college?: string;
  position?: string;
  highSchool?: string;
  awards?: string[];
  strengths?: string;
  weaknesses?: string;
  testimony?: string;
  profileImageUrl?: string;
  highlightVideos?: string[]; // Max 5
  diamondRating?: number; // 1–5, assigned by scouts later
  createdAt: Date;
  updatedAt: Date;
}
