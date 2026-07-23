import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} | ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4ee",
    theme_color: "#1c4a39",
    lang: "fa",
    dir: "rtl",
    icons: [
      { src: "/massage.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
