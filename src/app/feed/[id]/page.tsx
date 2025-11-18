import React from "react";
import PostDetail from "@/views/feed/post/PostDetail.view";
import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PageLayout pages={[navigation().home.links.feed]}>
      <PostDetail postId={id} />
    </PageLayout>
  );
}
