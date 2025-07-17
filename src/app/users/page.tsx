import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import { Metadata } from "next"; 
import Users from "@/views/users/Users.view";

export const metadata: Metadata = {
  title: "FAP — Users",
  description: "Manage users in the application",
  
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().management.links.users]}>
      <Users />
    </PageLayout>
  );
}
