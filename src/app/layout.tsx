import type { Metadata } from "next";
import { Bubblegum_Sans } from "next/font/google";
import "./globals.css";
import "../game/game.css";
import "../game/ui/cutscene.css";
import "../game/ui/intro.css";
const narrativeFont = Bubblegum_Sans({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-narrative",
});
export const metadata: Metadata = {
  title: "Sojourner — The Little Rover That Never Came Home",
  description: "An interactive story of a little rover, a red planet, and the extraordinary journey that connected them.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={narrativeFont.variable}><body>{children}</body></html>;
}



