import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Airdropper",
  description: "Distribute tokens, instantly.",
};

export default function RootLayout(props: {children: ReactNode}){
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 overflow-x-hidden overscroll-none">
        <Providers>
          <Header />
          {props.children}
        </Providers>
      </body>
    </html>
  );
}
