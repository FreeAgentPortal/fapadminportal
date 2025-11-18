import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import Dashboard from "@/views/dashboard/Dashboard.view";

export default function Home() {
  return (
    <PageLayout pages={[navigation().home.links.home]}>
      <Dashboard />
    </PageLayout>
  );
}
