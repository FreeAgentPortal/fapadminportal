/** Narrow string literal enums for safety + autocomplete */
export const EventType = {
  TRYOUT: 'tryout',
  PRACTICE: 'practice',
  SCRIMMAGE: 'scrimmage',
  GAME: 'game',
  CAMP: 'camp',
  COMBINE: 'combine',
  SHOWCASE: 'showcase',
  WORKOUT: 'workout',
  MEETING: 'meeting',
  OTHER: 'other',
} as const;
export type EventType = (typeof EventType)[keyof typeof EventType];

export const Visibility = {
  PUBLIC: 'public', // discoverable by everyone
  TEAM: 'team', // visible to users linked to the team profile
  INVITE_ONLY: 'invite-only', // visible to those invited or given a link
  PRIVATE: 'private', // internal/team-staff only
} as const;
export type Visibility = (typeof Visibility)[keyof typeof Visibility];

export const Audience = {
  ATHLETES: 'athletes',
  AGENTS: 'agents',
  SCOUTS: 'scouts',
  MEDIA: 'media',
  ALL: 'all',
} as const;
export type Audience = (typeof Audience)[keyof typeof Audience];

export const LocationKind = {
  PHYSICAL: 'physical',
  VIRTUAL: 'virtual',
} as const;
export type LocationKind = (typeof LocationKind)[keyof typeof LocationKind];

export interface EventDocument {
  _id: string;
  teamProfileId: string; // owner/organizer team
  createdByUserId: string; // auditing
  type: EventType;
  sport?: string; // “football”, “soccer”, etc. (freeform)
  title: string;
  description?: string;

  audience: Audience;
  visibility: Visibility;

  status: 'active' | 'scheduled' | 'completed' | 'canceled' | 'postponed';

  timezone: string; // IANA TZ, e.g., "America/New_York"
  startsAt: Date;
  endsAt: Date;
  allDay?: boolean;

  recurrence?: {
    freq?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    interval?: number;
    byWeekday?: number[];
    until?: Date;
  };

  location: {
    kind: LocationKind;
    physical?: {
      venueName?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
      geo?: { type: 'Point'; coordinates: [number, number] };
    };
    virtual?: {
      meetingUrl?: string;
      passcode?: string;
      platform?: string;
    };
  };

  opponents?: Array<{
    teamProfileId?: string;
    name?: string;
    level?: string;
  }>;

  registration?: {
    required: boolean;
    opensAt?: Date;
    closesAt?: Date;
    capacity?: number;
    waitlistEnabled: boolean;
    allowWalkIns: boolean;
    price?: number;
    currency?: string;
    questions: Array<{
      key: string;
      label: string;
      type: 'shortText' | 'longText' | 'singleSelect' | 'multiSelect' | 'number' | 'boolean' | 'url';
      required: boolean;
      options?: string[];
    }>;
  };

  eligibility?: {
    positions?: string[];
    ageRange?: { min?: number; max?: number };
    metrics?: Array<{ key: string; op: string; value: number }>;
    tags?: string[];
    verifiedOnly?: boolean;
    diamondMin?: number;
  };

  roster?: {
    maxParticipants?: number; // for practices/tryouts
    // future: lock roster, export, etc.
  };

  media?: Array<{ kind: 'image' | 'video' | 'link'; url: string; title?: string }>;
  tags?: string[];

  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
