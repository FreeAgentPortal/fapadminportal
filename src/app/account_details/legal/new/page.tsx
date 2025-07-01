import { navigation } from '@/data/navigation';
import PageLayout from '@/layout/page/Page.layout';
import LegalDetails from '@/views/legal/legalDetails/LegalDetails.view'; 

export default function Page() {
  return (
    <PageLayout pages={[navigation().admin.links.legal]} largeSideBar>
      <LegalDetails />
    </PageLayout>
  );
}
