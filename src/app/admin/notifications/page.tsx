import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import { Metadata } from "next"; 
import AlertDesk from "@/views/admin/alert_desk/AlertDesk.view";

export const metadata: Metadata = {
  title: "Notifications - System | FAP",
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().admin.links.notifications]}>
      <AlertDesk />
    </PageLayout>
  );
}
