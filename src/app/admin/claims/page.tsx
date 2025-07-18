import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import { Metadata } from "next"; 
import ClaimsManagement from "@/views/admin/claims_management/ClaimsManagement.view";

export const metadata: Metadata = {
  title: "Claims Management",
  description: "Manage user claims in the admin portal.",
  openGraph: {
    title: "Claims Management | Free Agent Portal",
    description: "Manage user claims in the Free Agent Portal admin.",
    url: "https://admin.freeagentportal.com/admin/claims",
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
    title: "Claims Management | Free Agent Portal",
    description: "Manage user claims in the Free Agent Portal admin.",
    images: ["/images/og-default.jpg"],
  },
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().admin.links.claims]}>
      <ClaimsManagement />
    </PageLayout>
  );
}
