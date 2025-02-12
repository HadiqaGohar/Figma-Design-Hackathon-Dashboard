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
    <body className={`${inter.className}  h-screen`}>
      {/* Sidebar */}
      {/* <SideNavbar /> */}

      {/* Main Content */}
      {/* flex-1 sm:ml-[36%] md:ml-[25%] lg:ml-[20%] xl:ml-[13%] overflow-auto */}
      <main >{children}</main>
    </body>
  </html>
  );
}
