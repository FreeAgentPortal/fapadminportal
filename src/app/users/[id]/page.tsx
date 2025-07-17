import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import UserDetails from "@/views/users/userDetails/UserDetails.view";

export default function Page() {
  return (
    <PageLayout pages={[navigation().management.links.users]}>
      <UserDetails />
    </PageLayout>
  );
}
