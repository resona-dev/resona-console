import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SideBar } from "./sidebar";
import { NavBar } from "./navbar";
import { Providers } from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Resona Dashboard",
  description: "Resona Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <SideBar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
              <NavBar />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
