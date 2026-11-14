import type { Metadata } from "next";
import "./globals.css";
import "../game/game.css";
import "../game/ui/cutscene.css";
import "../game/ui/intro.css";
export const metadata: Metadata = {
  title: "Sojourner — The Little Rover That Never Came Home",
  description: "An interactive story of a little rover, a red planet, and the extraordinary journey that connected them.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}



