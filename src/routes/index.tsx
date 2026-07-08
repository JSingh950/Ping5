import { createFileRoute } from "@tanstack/react-router";
import { PingStorePage } from "@/components/PingStorePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ping! — NFC Identity Network" },
      {
        name: "description",
        content:
          "A dark WebGL homepage for Ping!, the titanium NFC identity ring by Ping Ring Inc.",
      },
      { property: "og:title", content: "Ping! — NFC Identity Network" },
      {
        property: "og:description",
        content:
          "A black, white, and orange product experience for the Ping! identity ring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <PingStorePage />;
}
