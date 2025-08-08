import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation"; 
import TeamInvite from "@/views/teams/teamInvite/TeamInvite.view";

export default function Page() {
  return (
    <PageLayout pages={[navigation().management.links.teams]}>
      <TeamInvite />
    </PageLayout>
  );
}
