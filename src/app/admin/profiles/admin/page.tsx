import { navigation } from "@/data/navigation";
import PageLayout from "@/layout/page/Page.layout";
import AdminProfiles from "@/views/admin/admin_profiles";

export default function AdminProfilesPage() {
  return (
    <PageLayout pages={[navigation().admin.links.admin_profiles]}>
      <AdminProfiles />
    </PageLayout>
  );
}
