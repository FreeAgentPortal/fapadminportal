import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import SupportDetails from "@/views/support/supportDetails/SupportDetails.view";
import SupportTicketOptions from "@/views/support/support_ticket_options/SupportTicketOptions.component";
import { BsGear } from "react-icons/bs";

export default function Component() {
  return (
    <PageLayout pages={[navigation().account_details.links.support]}>
      <SupportDetails />
    </PageLayout>
  );
}
