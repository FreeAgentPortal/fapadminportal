import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import { Metadata } from "next";
import WorkInProgress from "@/components/wip/WorkInProgress.component";
import Transactions from "@/views/admin/transactions/Transactions.view";

export const metadata: Metadata = {
  title: "Transactions",
  description: "Manage Transactions",
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().admin.links.transactions]}>
      <Transactions />
    </PageLayout>
  );
}
