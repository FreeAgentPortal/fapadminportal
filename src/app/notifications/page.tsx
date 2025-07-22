import NotificationsView from '@/views/notifications/NotificationsView.view';
import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAP | Notifications',
  description: 'Notifications for FAP',
};

export default function Home() {
  return (
    <PageLayout pages={[navigation().home.links.notifications]}>
      <NotificationsView />
    </PageLayout>
  );
}
