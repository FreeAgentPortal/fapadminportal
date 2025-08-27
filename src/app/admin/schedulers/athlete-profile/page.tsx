import { navigation } from "@/data/navigation";
import PageLayout from "@/layout/page/Page.layout";
import IncompleteProfiles from "@/views/athletes/incompleteProfiles/IncompleteProfiles.view";
import { Metadata } from "next";
import React from "react";

// metadata
export const metadata: Metadata = {
  title: "Athlete Profile Scheduler",
  description: "Manage athlete profile scheduling and completion.",
};

const AthleteProfileSchedulerPage: React.FC = () => {
  return (
    <PageLayout pages={[navigation().admin.links.schedulers]}>
      <IncompleteProfiles />
    </PageLayout>
  );
};

export default AthleteProfileSchedulerPage;
