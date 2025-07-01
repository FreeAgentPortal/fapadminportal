import { navigation } from '@/data/navigation';
import PageLayout from '@/layout/page/Page.layout';
import LegalTable from '@/views/legal/LegalTable.view';

export default function Page() {
  return (
    <PageLayout pages={[navigation().admin.links.legal]} largeSideBar>
      <LegalTable />
    </PageLayout>
  );
}
