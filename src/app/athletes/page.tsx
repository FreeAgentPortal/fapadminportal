import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import { Metadata } from "next";
import Athlete from "@/views/athletes/Athlete.view";

export const metadata: Metadata = {
  title: "Athletes",
  description: "Manage athletes",
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().management.links.athletes]}>
      <Athlete />
    </PageLayout>
  );
}
