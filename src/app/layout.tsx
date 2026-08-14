import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.buywiz.eu"),
  title: {
    default: "Buywiz | Product compliance in één workflow",
    template: "%s | Buywiz",
  },
  description:
    "Buywiz helpt importeurs, distributeurs en productteams productvereisten, leveranciersdocumentatie en compliancegereedheid in één workflow te beheren.",
  openGraph: {
    title: "Buywiz | Product compliance in één workflow",
    description:
      "Van productvereisten tot leveranciersbewijs en compliancebeoordeling in één workflow.",
    url: "https://www.buywiz.eu",
    siteName: "Buywiz",
    locale: "nl_NL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
