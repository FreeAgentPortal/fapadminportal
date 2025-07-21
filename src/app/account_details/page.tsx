import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import { Metadata } from "next";  
import AccountDetails from "@/views/account_details/AccountDetails.screen";

export const metadata: Metadata = {
  title: "FAP | Account Details",
  description: "Manage your account settings and support requests.",
  openGraph: {
    title: "Account Details | Free Agent Portal",
    description: "Manage your account settings and support requests in the Free Agent Portal.",
    url: "https://admin.freeagentportal.com/account_details",
    siteName: "Free Agent Portal",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Free Agent Portal Account Details",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Account Details | Free Agent Portal",
    description: "Manage your account settings and support requests in the Free Agent Portal.",
    images: ["/images/og-default.jpg"],
  },
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().account_details.links.account_details]}>
      <AccountDetails />
    </PageLayout>
  );
}
