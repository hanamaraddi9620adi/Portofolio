import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hanamaraddi Kanakannavar Portfolio",
    short_name: "HK Portfolio",
    start_url: "/",
    display: "standalone",
    background_color: "#101111",
    theme_color: "#101111",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
