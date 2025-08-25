import React from "react";
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  LoadingOutlined, 
  PlayCircleOutlined,
  PauseCircleOutlined
} from "@ant-design/icons";
import { SchedulerStatus } from "../SchedulerChecker.types";

export const getStatusIcon = (status: SchedulerStatus["status"], isRunning?: boolean): React.ReactNode => {
  if (status === "loading") {
    return <LoadingOutlined style={{ color: "#1890ff" }} />;
  }
  if (status === "offline" || status === "error") {
    return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
  }
  if (isRunning) {
    return <PlayCircleOutlined style={{ color: "#52c41a" }} />;
  }
  return <PauseCircleOutlined style={{ color: "#faad14" }} />;
};

export const getStatusColor = (status: SchedulerStatus["status"], isRunning?: boolean): string => {
  if (status === "loading") return "processing";
  if (status === "offline" || status === "error") return "error";
  if (isRunning) return "success";
  return "warning";
};

export const formatNextRun = (nextRun: string): string => {
  const date = new Date(nextRun);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) {
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    return `${diffMinutes}m`;
  }
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d`;
};

export const getOverallStatus = (
  anyLoading: boolean, 
  allOnline: boolean, 
  anyRunning: boolean
): { color: string; text: string } => {
  if (anyLoading) return { color: "#1890ff", text: "Checking..." };
  if (allOnline && anyRunning) return { color: "#52c41a", text: "Schedulers Active" };
  if (allOnline) return { color: "#faad14", text: "Schedulers Idle" };
  return { color: "#ff4d4f", text: "Scheduler Issues" };
};
