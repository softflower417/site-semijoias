import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });
const lato = Lato({ weight: ['300', '400', '700'], subsets: ["latin"], variable: '--font-lato' });

export const metadata: Metadata = {
  title: "SAONA Semijoias",
  description: "Elegância, feminilidade e atemporalidade.",
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
