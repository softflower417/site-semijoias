import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair', display: 'swap' });
const lato = Lato({ weight: ['300', '400', '700'], subsets: ["latin"], variable: '--font-lato', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: "SAONA Semijoias",
    template: "%s | SAONA Semijoias",
  },
  description: "Semijoias com elegância, feminilidade e atemporalidade. Brincos, colares, pulseiras, braceletes e anéis com banho de ouro.",
  openGraph: {
    title: "SAONA Semijoias",
    description: "Brilho em cada detalhe.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${lato.variable} ${playfair.variable} font-sans`}>{children}</body>
    </html>
  );
}
