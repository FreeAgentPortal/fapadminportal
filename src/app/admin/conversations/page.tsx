import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import { Metadata } from "next";  
import Conversation from "@/views/admin/conversation/Conversation.screen";

export const metadata: Metadata = {
  title: "Conversation Management",
  description: "Manage user conversations in the admin portal.",
  openGraph: {
    title: "Conversation Management | Free Agent Portal",
    description: "Manage user conversations in the Free Agent Portal admin.",
    url: "https://admin.freeagentportal.com/admin/conversations",
    siteName: "Free Agent Portal",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Free Agent Portal Claims Management",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conversation Management | Free Agent Portal",
    description: "Manage user conversations in the Free Agent Portal admin.",
    images: ["/images/og-default.jpg"],
  },
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().admin.links.conversations]}>
      <Conversation />
    </PageLayout>
  );
}
