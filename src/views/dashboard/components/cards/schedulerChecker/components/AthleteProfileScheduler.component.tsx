import React from "react";
import useApiHook from "@/hooks/useApi";
import { SchedulerData } from "../SchedulerChecker.types";

interface AthleteProfileSchedulerProps {
  children: (data: {
    schedulerData?: SchedulerData;
    isLoading: boolean;
    isError: boolean;
    error?: any;
    responseTime?: number;
    lastChecked?: Date;
  }) => React.ReactNode;
}

const AthleteProfileScheduler: React.FC<AthleteProfileSchedulerProps> = ({ children }) => {
  const startTime = React.useRef<number>(0);
  const [responseTime, setResponseTime] = React.useState<number>();
  const [lastChecked, setLastChecked] = React.useState<Date>();

  const query = useApiHook({
    method: "GET",
    url: "/profiles/athlete/scheduler/status",
    key: ["scheduler-status", "/profiles/athlete/scheduler/status"],
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 180000, // 3 minutes
    cacheTime: 300000, // 5 minutes
    onSuccessCallback: (data) => {
      const endTime = Date.now();
      setResponseTime(endTime - startTime.current);
      setLastChecked(new Date());
    },
    onErrorCallback: (error) => {
      const endTime = Date.now();
      setResponseTime(endTime - startTime.current);
      setLastChecked(new Date());
    },
  }) as any;

  // Track request start time
  React.useEffect(() => {
    if (query.isFetching) {
      startTime.current = Date.now();
    }
  }, [query.isFetching]);

  return (
    <>
      {children({
        schedulerData: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        responseTime,
        lastChecked,
      })}
    </>
  );
};

export default AthleteProfileScheduler;
