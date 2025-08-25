"use client";

import WorkInProgress from "@/components/wip/WorkInProgress.component";
import { navigation } from "@/data/navigation";
import PageLayout from "@/layout/page/Page.layout";
import React from "react";

const AthleteProfileSchedulerPage: React.FC = () => {
  return (
    <PageLayout pages={[navigation().admin.links.schedulers]}>
      <WorkInProgress
        title="Athlete Profile Checker Details"
        description="Detailed analytics and management for the Athlete Profile Checker. This will include profile completion analytics, missing field reports, athlete management tools, and automated profile enhancement features."
        backUrl="/"
        backLabel="Back to Dashboard"
        estimatedCompletion="Phase 2"
      />
    </PageLayout>
  );
};

export default AthleteProfileSchedulerPage;
