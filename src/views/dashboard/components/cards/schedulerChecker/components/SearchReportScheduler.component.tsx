import React from "react";
import useApiHook from "@/hooks/useApi";
import { SchedulerData } from "../SchedulerChecker.types";

interface SearchReportSchedulerProps {
  children: (data: {
    schedulerData?: SchedulerData;
    isLoading: boolean;
    isError: boolean;
    error?: any;
    responseTime?: number;
    lastChecked?: Date;
  }) => React.ReactNode;
}

const SearchReportScheduler: React.FC<SearchReportSchedulerProps> = ({ children }) => {
  const startTime = React.useRef<number>(0);
  const [responseTime, setResponseTime] = React.useState<number>();
  const [lastChecked, setLastChecked] = React.useState<Date>();

  const query = useApiHook({
    method: "GET",
    url: "/search-preference/scheduler/status",
    key: ["scheduler-status", "/search-preference/scheduler/status"],
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

export default SearchReportScheduler;
