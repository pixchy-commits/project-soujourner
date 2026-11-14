import { notFound } from "next/navigation";
import SceneWorkspace from "@/game/narrative/workspace/SceneWorkspace";
export default function SceneWorkspacePage() {
 if (process.env.NODE_ENV !== "development") notFound();
 return <SceneWorkspace />;
}
