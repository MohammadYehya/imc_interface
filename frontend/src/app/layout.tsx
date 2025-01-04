import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "IMC Interface",
  description: "Underbody Sealant Detection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
