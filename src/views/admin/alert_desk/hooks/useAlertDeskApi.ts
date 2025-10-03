import useApiHook from "@/hooks/useApi";

/**
 * Hook to fetch athletes data with optional search
 */
export const useAthletes = (search?: string) => { 

  const { data, isLoading, isError, error } = useApiHook({
    url: `/profiles/athlete`,
    key: ["athletes", search || "all"],
    method: "GET",
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    keyword: search,
  }) as any;
  return { data, isLoading, isError, error };
};

/**
 * Hook to fetch teams data with optional search
 */
export const useTeams = (search?: string) => {

  const { data, isLoading, isError, error } = useApiHook({
    method: "GET",
    url: `/profiles/team`,
    key: ["teams", search || "all"],
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    keyword: search,
  }) as any;
  return { data, isLoading, isError, error };
};

/**
 * Hook to send alerts
 */
export const useSendAlert = () => {
  return useApiHook({
    method: "POST",
    key: ["sendAlert"],
    queriesToInvalidate: ["alerts"],
    onSuccessCallback: (data: any) => {
      console.log("Alert sent successfully:", data);
    },
    onErrorCallback: (error: any) => {
      console.error("Failed to send alert:", error);
    },
  });
};

/**
 * Hook to get filtered athletes based on criteria
 */
export const useFilteredAthletes = (filters?: { position?: string; team?: string; location?: string }) => {
  const filterParams = filters
    ? Object.entries(filters)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
    : "";

  const filterKey = filters ? JSON.stringify(filters) : "none";

  return useApiHook({
    method: "GET",
    url: `/athletes${filterParams ? `?${filterParams}` : ""}`,
    key: `athletes-filtered-${filterKey}`,
    enabled: !!filters && Object.keys(filters).length > 0,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get filtered teams based on criteria
 */
export const useFilteredTeams = (filters?: { league?: string; location?: string; minMembers?: number }) => {
  const filterParams = filters
    ? Object.entries(filters)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
    : "";

  const filterKey = filters ? JSON.stringify(filters) : "none";

  return useApiHook({
    method: "GET",
    url: `/teams${filterParams ? `?${filterParams}` : ""}`,
    key: `teams-filtered-${filterKey}`,
    enabled: !!filters && Object.keys(filters).length > 0,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
