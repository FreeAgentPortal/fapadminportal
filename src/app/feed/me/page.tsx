import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import type { Metadata } from 'next';
import MyPosts from '@/views/feed/myPosts/MyPosts.view';

export const metadata: Metadata = {
  title: 'Free Agent Portal | My Posts',
  description: 'Social feed for professional athletes - connect, share updates, and engage with the athletic community on Free Agent Portal.',
};

export default function Component() {
  return (
    <PageLayout pages={[navigation().home.links.my_posts]} largeSideBar>
      <MyPosts />
    </PageLayout>
  );
}
