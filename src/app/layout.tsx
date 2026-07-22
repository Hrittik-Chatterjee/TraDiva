import type { Metadata } from "next";
import "./globals.css";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import PostHogPageView from "@/components/providers/posthog-pageview";
import { CartProvider } from "@/components/providers/cart-provider";
import CartSheet from "@/components/storefront/CartSheet";
import Navbar from "@/components/layout/navbar";
import MainContainer from "@/components/layout/main-container";
import Footer from "@/components/layout/footer";
import { getCategories } from "@/services/catalog";
import { ModalProvider } from "@/components/providers/modal-provider";

export const metadata: Metadata = {
  title: "TraDiva - Premium E-commerce",
  description: "Modern production-ready e-commerce platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categoriesList = await getCategories();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-screen flex flex-col bg-canvas text-ink">
        <PostHogProvider>
          <PostHogPageView />
          <ModalProvider>
            <CartProvider>
              <Navbar categories={categoriesList} />
              <MainContainer>{children}</MainContainer>
              <CartSheet />
              <Footer />
            </CartProvider>
          </ModalProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
