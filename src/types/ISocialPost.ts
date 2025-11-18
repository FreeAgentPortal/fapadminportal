// domain/post.ts
export type ActorId = `user:${string}` | `team:${string}`;

export type MediaKind = 'image' | 'video';
export interface Media {
  kind: MediaKind;
  url: string; // canonical media URL (CDN)
  thumbUrl?: string; // for videos or large images
  width?: number;
  height?: number;
  // video only
  durationSec?: number;
  // processing pipeline metadata (non-critical)
  processing?: 'pending' | 'ready' | 'failed';
}

export interface LinkPreview {
  url: string;
  canonicalUrl?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  siteName?: string;
}

export type Visibility = 'public' | 'followers' | 'private';

export interface Post {
  objectDetails: any;
  object: {
    collection: 'posts' | 'events' | 'other';
    id: string;
  };
  _id: string;

  profile: {
    type: 'athleteprofile' | 'teamprofile';
    id: string;
  };
  actorId: ActorId; // "user:..." or "team:..."
  body?: string; // markdown-lite / plain text
  sport?: string; // e.g., "football" for easy filtering
  hashtags?: string[]; // ["QB","combine"]
  mentions?: ActorId[]; // ["user:...", "team:..."]
  media?: Media[]; // images/videos
  links?: LinkPreview[]; // zero or more rich link previews
  visibility: Visibility; // default: public

  // Controls/flags
  allowComments: boolean; // default: true
  isEdited: boolean; // toggled when edit history exists
  editHistory?: { editedAt: Date; note?: string }[]; // lightweight audit

  // Soft delete & moderation
  isDeleted: boolean;
  deletedAt?: Date;
  moderation?: {
    status: 'clean' | 'flagged' | 'removed';
    reason?: string; // short label/code
    updatedAt?: Date;
  };

  // Denormalized counters (updated elsewhere)
  counts: {
    reactions: number;
    comments: number;
    shares: number;
    views: number;
  };

  createdAt: Date;
  updatedAt: Date; // last user edit (not counter bumps)
}
