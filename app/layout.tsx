import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Party Number Drawer",
  description: "パーティーで使える番号抽選アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
