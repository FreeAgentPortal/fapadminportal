import { navigation } from "@/data/navigation";
import PageLayout from "@/layout/page/Page.layout"; 
import SupportDesk from "@/views/support/SupportDesk.view";

export default function Home() {
  return (
    <PageLayout pages={[navigation().admin.links.support ]} largeSideBar>
      <SupportDesk />
    </PageLayout>
  );
}
