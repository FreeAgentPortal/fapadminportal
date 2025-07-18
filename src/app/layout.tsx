import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/antd-overrides.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import "@ant-design/v5-patch-for-react-19";
import AppWrapper from "@/layout/appWrapper/AppWrapper";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin | Free Agent Portal",
  description: "Admin portal",
  metadataBase: new URL("https://admin.freeagentportal.com"),
  openGraph: {
    title: "Admin | Free Agent Portal",
    description: "Log in or register to access your profile on the Free Agent Portal.",
    url: "https://admin.freeagentportal.com",
    siteName: "Free Agent Portal",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Free Agent Portal Auth",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Admin | Free Agent Portal",
    description: "Log in or sign up for the Free Agent Portal.",
    images: ["/images/og-default.jpg"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReactQueryProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <AppWrapper>
              <AntdRegistry>{children}</AntdRegistry>
            </AppWrapper>
          </Suspense>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
