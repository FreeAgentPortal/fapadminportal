import { navigation } from "@/data/navigation";
import PageLayout from "@/layout/page/Page.layout";
import ScoutProfiles from "@/views/admin/scout_profiles/ScoutProfiles.view";

export default function AdminProfilesPage() {
  return (
    <PageLayout pages={[navigation().admin.links.scout_profiles]}>
      <ScoutProfiles />
    </PageLayout>
  );
}
