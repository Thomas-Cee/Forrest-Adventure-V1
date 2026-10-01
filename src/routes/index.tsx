import { createFileRoute } from "@tanstack/react-router";
import { ForestAdventure } from "@/components/ForestAdventure";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <ForestAdventure />;
}
