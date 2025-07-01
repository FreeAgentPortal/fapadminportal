import { navigation } from "@/data/navigation";
import PageLayout from "@/layout/page/Page.layout";
import SupportDeskAdmin from "@/views/supportAdmin/SupportDeskAdmin.view";

export default function Home() {
  return (
    <PageLayout pages={[navigation().admin.links.support_admin]} largeSideBar>
      <SupportDeskAdmin />
    </PageLayout>
  );
}
