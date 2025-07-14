import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import { Metadata } from "next";
import Teams from "@/views/teams/Teams.view";

export const metadata: Metadata = {
  title: "Teams | FreeAgent Admin",
  description: "Manage teams",
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().management.links.teams]}>
      <Teams />
    </PageLayout>
  );
}
