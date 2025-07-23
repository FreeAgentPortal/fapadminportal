import AthleteCard from "@/components/athleteCard/AthleteCard.component";
import useApiHook from "@/hooks/useApi";
import React from "react";

const RecentAthleteSignups = () => {
  // find results from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data } = useApiHook({
    url: "/profiles/athlete",
    method: "GET",
    key: "recent-athlete-signups",
    filter: `createdAt;{"$gte":"${thirtyDaysAgo.toISOString()}"}`,
  }) as any;
  return (
    <div>
      {data?.payload?.map((athlete: any) => (
        <AthleteCard key={athlete._id} athlete={athlete} sm />
      ))}
    </div>
  );
};

export default RecentAthleteSignups;
