import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SideNavbar from "./components/SideNavbar";
// import Navbar from "./components/SideNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HG-Dashboard",
  description: "Template-0 Dashboard ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={`${inter.className} flex h-screen`}>
      {/* Sidebar */}
      <SideNavbar />

      {/* Main Content */}
      <main className="flex-1 ml-[13%] overflow-auto">{children}</main>
    </body>
  </html>
  );
}
