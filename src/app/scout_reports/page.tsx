import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import { Metadata } from "next";
import ScoutReports from "@/views/scout_reports/ScoutReports.view";

export const metadata: Metadata = {
  title: "Scout Reports | FreeAgent Admin",
  description: "Manage scout reports",
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().management.links.scout_reports]}>
      <ScoutReports />
    </PageLayout>
  );
}
