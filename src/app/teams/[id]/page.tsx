import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import TeamDetails from "@/views/teams/teamDetails/TeamDetails.view";

export default function Page() {
  return (
    <PageLayout pages={[navigation().management.links.teams]}>
      <TeamDetails />
    </PageLayout>
  );
}
