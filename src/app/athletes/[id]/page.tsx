import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation"; 
import AthleteDetails from "@/views/athletes/athleteDetails/AthleteDetails.view";

export default function Page() {
  return (
    <PageLayout pages={[navigation().management.links.athletes]}>
      <AthleteDetails />
    </PageLayout>
  );
}
