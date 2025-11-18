import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import type { Metadata } from 'next';
import Feed from '@/views/feed/Feed.view';

export const metadata: Metadata = {
  title: 'Free Agent Portal | Feed',
  description: 'Social feed for professional athletes - connect, share updates, and engage with the athletic community on Free Agent Portal.',
};

export default function Component() {
  return (
    <PageLayout pages={[navigation().home.links.feed]} largeSideBar>
      <Feed />
    </PageLayout>
  );
}
