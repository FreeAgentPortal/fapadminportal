import WorkInProgress from "@/components/wip/WorkInProgress.component";
import { navigation } from "@/data/navigation";
import PageLayout from "@/layout/page/Page.layout";
import React from "react";

const SearchReportSchedulerPage: React.FC = () => {
  return (
    <PageLayout pages={[navigation().admin.links.schedulers]}>
      <WorkInProgress
        title="Search Report Scheduler Details"
        description="Detailed analytics and management for the Search Report Scheduler. This will include comprehensive statistics, execution history, configuration options, and troubleshooting tools."
        backUrl="/"
        backLabel="Back to Dashboard"
        estimatedCompletion="Phase 2"
      />
    </PageLayout>
  );
};

export default SearchReportSchedulerPage;
