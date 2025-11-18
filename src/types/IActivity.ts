export type ActivityCollection = 'events' | 'posts' | 'users' | 'teams' | string;
export type ActivityRef = { collection: ActivityCollection; id: string };
export interface IActivity {
  verb: string; // e.g., "created", "joined", "liked"
  actorId: string; // e.g., "team:abc" or "user:123"
  object: ActivityRef; // pointer to canonical doc
  visibility: 'public'; // MVP
  summary?: string;
  thumbUrl?: string;
  sport?: string;
  tags?: string[];
  idempotencyKey?: string;

  createdAt: Date;
  updatedAt: Date;
}
