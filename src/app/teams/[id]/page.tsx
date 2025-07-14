import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";

export default function Page() {
  return (
    <PageLayout pages={[navigation().management.links.teams]}>
      <></>
    </PageLayout>
  );
}
