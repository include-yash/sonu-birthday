import { createFileRoute } from "@tanstack/react-router";
import { SonuApp } from "@/components/sonu/SonuApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SONU.EXE — A Royal Birthday Adventure" },
      { name: "description", content: "An interactive, slightly unhinged birthday adventure made for Sonu. October 11, 2026." },
      { property: "og:title", content: "SONU.EXE — A Royal Birthday Adventure" },
      { property: "og:description", content: "An interactive, slightly unhinged birthday adventure made for Sonu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SonuApp,
});
