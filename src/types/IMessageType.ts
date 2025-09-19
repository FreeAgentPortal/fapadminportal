export interface IMessage {
  conversation: string;
  receiver: {
    profile: string;
    role: "team" | "athlete";
  };
  sender: {
    profile: string;
    role: "team" | "athlete";
  };
  // Admin/Moderator fields
  status: 'active' | 'archived' | 'hidden' | 'deleted';
  moderationActions: Array<{
    performedBy: {
      profile: string;
      role: 'team' | 'athlete' | 'admin';
    };
    action: 'created' | 'edited' | 'archived' | 'hidden' | 'restored' | 'deleted';
    reason?: string;
    timestamp: Date;
    previousState?: {
      status: 'active' | 'archived' | 'hidden' | 'deleted';
      isArchived: boolean;
      isHidden: boolean;
    };
  }>;

  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
