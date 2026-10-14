import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mechanic.ithelpers.com.au";

export const metadata: Metadata = {
  title: "Apex Precision Mechanical | European & Japanese Auto Specialists",
  description:
    "Dealer-grade diagnostics, statutory logbook servicing, and mechanical repairs. Maintain new car warranty with certified master technicians.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Apex Precision Mechanical | European & Japanese Auto Specialists",
    description:
      "Dealer-grade diagnostics, statutory logbook servicing, and mechanical repairs. Maintain new car warranty with certified master technicians.",
    url: siteUrl,
    siteName: "Apex Precision Mechanical",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex Precision Mechanical | European & Japanese Auto Specialists",
    description:
      "Dealer-grade diagnostics, statutory logbook servicing, and mechanical repairs. Maintain new car warranty with certified master technicians.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#000000] text-[#F6F6F6] antialiased">
        {children}
      </body>
    </html>
  );
}
