// Utility functions for AlertDesk component

import { IAthlete } from "@/types/IAthleteType";
import { ITeamType } from "@/types/ITeamType";

export interface AlertFormData {
  type: "athlete" | "team" | "all";
  title: string;
  message: string;
  targetUsers: string[];
}

export interface Metadata {
  page: number;
  pages: number;
  totalCount: number;
  prevPage: number;
  nextPage: number;
}

/**
 * Calculate the total number of recipients based on alert type and selected users
 */
export const getRecipientCount = (
  alertType: "athlete" | "team" | "all",
  selectedUsers: string[],
  athletesMeta: Metadata,
  teamsMeta: Metadata
): number => {
  if (selectedUsers.length > 0) {
    return selectedUsers.length;
  }

  switch (alertType) {
    case "athlete":
      return athletesMeta?.totalCount;
    case "team":
      return teamsMeta?.totalCount;
    case "all":
      return athletesMeta?.totalCount + teamsMeta?.totalCount;
    default:
      return 0;
  }
};

/**
 * Get athlete options for select dropdown
 */
export const getAthleteOptions = (athletes: IAthlete[]) => {
  return athletes?.map((athlete) => ({
    key: athlete._id,
    value: athlete._id,
    label: `${athlete.fullName}`,
  }));
};

/**
 * Get team options for select dropdown
 */
export const getTeamOptions = (teams: ITeamType[]) => {
  return teams?.map((team) => ({
    key: team._id,
    value: team._id,
    label: `${team.name}`,
  }));
};

/**
 * Validate alert form data
 */
export const validateAlertForm = (formData: Partial<AlertFormData>): string[] => {
  const errors: string[] = [];

  if (!formData.title?.trim()) {
    errors.push("Alert title is required");
  }

  if (!formData.message?.trim()) {
    errors.push("Alert message is required");
  }

  if (!formData.type) {
    errors.push("Alert type is required");
  }

  if (formData.message && formData.message.length > 500) {
    errors.push("Message must be 500 characters or less");
  }

  return errors;
};

/**
 * Format alert data for API submission
 */
export const formatAlertForSubmission = (formData: AlertFormData, recipientCount: number) => {
  return {
    type: formData.type,
    title: formData.title,
    message: formData.message,
    targetUsers: formData.targetUsers,
    recipientCount,
    timestamp: new Date().toISOString(),
  };
};
