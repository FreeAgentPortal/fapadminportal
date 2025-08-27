export interface CompletionInfo {
  isComplete: boolean;
  missingFields: string[];
  completionPercentage: number;
  criticalFieldsMissing: string[];
}

export interface IncompleteAthlete {
  id: string;
  _id?: string;
  fullName: string;
  profileImageUrl?: string | null;
  college?: string;
  graduationYear?: number;
  completion: CompletionInfo;
}

export interface IncompleteProfilesData {
  payload: IncompleteAthlete[];
  metadata: {
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ColumnHandlers {
  handleAthleteClick: (athleteId: string) => void;
  handleEditClick: (athleteId: string, e: React.MouseEvent) => void;
}
