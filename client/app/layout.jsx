import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";

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

export const metadata = {
  title: "AuraMax — AI Beauty & Fashion",
  description: "Your personalized AI beauty and style consultant. Get tailored skincare, fashion, and hair care recommendations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-[#FAF6F0]`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
