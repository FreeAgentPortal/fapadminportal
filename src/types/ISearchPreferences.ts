export interface ISearchPreferences {
  _id: string; // Unique identifier for the search preferences
  ownerType: 'team' | 'scout' | 'agent';
  name: string; // Optional name for the search preferences
  description?: string; // Optional description for the search preferences
  tags?: string[]; // Optional tags for categorization
  // frequency and frequncyType,
  frequency?: number; // Optional frequency for updates
  frequencyType?: 'daily' | 'weekly' | 'monthly'; // Optional frequency type
  numberOfResults?: number; // Optional number of results to return
  dateLastRan?: Date; // Optional date when the search was last run
  ownerId: string; // Linked to TeamProfile, ScoutProfile, etc.
  positions?: string[]; // Array of positions to filter athletes
  ageRange?: { min: number; max: number };
  performanceMetrics?: {
    [metric: string]: {
      min?: number;
      max?: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}
