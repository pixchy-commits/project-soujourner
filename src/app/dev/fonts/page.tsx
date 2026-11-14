import { Bubblegum_Sans, Chewy, Science_Gothic } from "next/font/google";
import { notFound } from "next/navigation";
import FontComparison from "./FontComparison";

const science = Science_Gothic({ subsets: ["latin"], weight: "800", display: "swap" });
const chewy = Chewy({ subsets: ["latin"], weight: "400", display: "swap" });
const bubblegum = Bubblegum_Sans({ subsets: ["latin"], weight: "400", display: "swap" });

export default function FontDemoPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <FontComparison science={science.className} chewy={chewy.className} bubblegum={bubblegum.className} />;
}
