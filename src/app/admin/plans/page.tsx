import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import { Metadata } from "next";
import PlansFeatures from "@/views/admin/plans_and_features/PlansFeatures.view";

export const metadata: Metadata = {
  title: "Plans and Features",
  description: "Manage Plans and Features",
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().admin.links.plans]}>
      <PlansFeatures />
    </PageLayout>
  );
}
