import { ImageResponse } from "next/og";
export const alt = "Hanamaraddi Kanakannavar — AI & Data Science";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#101111",
        color: "#eeeae4",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <div style={{ fontSize: 22, color: "#ef7058", letterSpacing: 5 }}>
        AI & DATA SCIENCE / BENGALURU
      </div>
      <div style={{ fontSize: 83, marginTop: 45, lineHeight: 1.1 }}>
        Turning data into possibility.
      </div>
      <div style={{ fontSize: 30, marginTop: 45 }}>
        Hanamaraddi Kanakannavar
      </div>
      <div style={{ fontSize: 20, marginTop: 15, color: "#aaa8a2" }}>
        Machine Learning · Data Analysis · Useful Software
      </div>
    </div>,
    size,
  );
}
