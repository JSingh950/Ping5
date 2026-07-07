import { createFileRoute } from "@tanstack/react-router";
import { PingStorePage } from "@/components/PingStorePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ping! — WebGL Identity Protocol" },
      {
        name: "description",
        content:
          "A Raven-inspired WebGL homepage for Ping!, the titanium NFC identity ring by Ping Ring Inc.",
      },
      { property: "og:title", content: "Ping! — WebGL Identity Protocol" },
      {
        property: "og:description",
        content:
          "A black, white, and electric-green WebGL product experience with floating titanium smart rings.",
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
