import type { Metadata } from "next";
import "./globals.css";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import PostHogPageView from "@/components/providers/posthog-pageview";

export const metadata: Metadata = {
  title: "TraDiva - Premium E-commerce",
  description: "Modern production-ready e-commerce platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <PostHogProvider>
          <PostHogPageView />
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
