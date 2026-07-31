import { Shell } from "@/components/Shell";
import { loadSiteContent } from "@/lib/content";

export default function Home() {
  const content = loadSiteContent();
  return <Shell content={content} />;
}
