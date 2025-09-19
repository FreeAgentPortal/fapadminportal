export interface IConversation {
  participants: {
    team: string;
    athlete: string;
  };
  // Admin/Moderator fields
  status: "active" | "archived" | "hidden" | "deleted";
  moderationActions: Array<{
    performedBy: {
      profile: string;
      role: "team" | "athlete" | "admin";
    };
    action: "created" | "edited" | "archived" | "hidden" | "restored" | "deleted";
    reason?: string;
    timestamp: Date;
    previousState?: {
      status: "active" | "archived" | "hidden" | "deleted";
      isArchived: boolean;
      isHidden: boolean;
    };
  }>;
  messages: string[];
  createdAt: Date;
  updatedAt: Date;
}
