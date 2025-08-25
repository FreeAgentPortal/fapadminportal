export interface SchedulerStatistics {
  // Search Report Scheduler Statistics
  totalSearchPreferences?: number;
  activeSearchPreferences?: number;
  successCount?: number;
  failureCount?: number;
  // Athlete Profile Checker Statistics
  totalAthletes?: number;
  incompleteProfiles?: number;
  completionRate?: number;
  missingFields?: {
    profileImage?: number;
    metrics?: number;
    measurements?: number;
    resume?: number;
  };
}

export interface SchedulerInfo {
  isRunning: boolean;
  nextRun: string;
}

export interface SchedulerData {
  success: boolean;
  data: {
    scheduler: SchedulerInfo;
    statistics: SchedulerStatistics;
  };
}

export interface SchedulerStatus {
  name: string;
  endpoint: string;
  description?: string;
  status: "online" | "offline" | "loading" | "error";
  responseTime?: number;
  lastChecked?: Date;
  schedulerData?: SchedulerData;
}
