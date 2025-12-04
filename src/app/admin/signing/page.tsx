import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import { Metadata } from "next";
import SigningManagement from "@/views/admin/signings_management/SigningManagement.view";

export const metadata: Metadata = {
  title: "Signings",
  description: "Manage athlete signings and team contracts",
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().admin.links.signings]}>
      <SigningManagement />
    </PageLayout>
  );
}
