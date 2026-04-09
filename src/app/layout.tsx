import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Patient Visit Tracker",
  description: "Track clinicians, patients, and visits with Next.js, Prisma, and Neon PostgreSQL.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${plusJakartaSans.variable}`}>{children}</body>
    </html>
  );
}
