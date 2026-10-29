import Image from "next/image";

export function ProjectArt({ kind, image }: { kind: string; image?: string }) {
  if (image) {
    return (
      <div className="project-art screenshot" aria-hidden="true">
        <Image src={image} alt="" fill sizes="(max-width: 700px) 88vw, 600px" />
        <span className="art-label">SWINGLENS / PRODUCT WALKTHROUGH</span>
        <span className="art-corner">WATCH THE DEMO ↗</span>
      </div>
    );
  }
  return (
    <div className={`project-art ${kind}`} aria-hidden="true">
      <span className="art-label">
        {kind === "housing"
          ? "REGRESSION / SPATIAL STUDY"
          : kind === "navia"
            ? "NAVIA / SIGNAL EXPLORATION"
            : kind === "systems"
              ? "SYSTEM ARCHITECTURE"
              : "COMPUTATIONAL STUDY"}
      </span>
      {kind === "housing" ? (
        <div className="city">
          {Array.from({ length: 24 }, (_, i) => (
            <i key={i} style={{ height: `${35 + ((i * 37) % 110)}px` }} />
          ))}
        </div>
      ) : kind === "systems" ? (
        <div className="system-nodes">
          <span>REST</span>
          <i />
          <span>SPRING</span>
          <i />
          <span>DATA</span>
        </div>
      ) : (
        <svg viewBox="0 0 600 260">
          <defs>
            <linearGradient id={`fade-${kind}`} x2="0" y2="1">
              <stop stopColor="#f66b50" stopOpacity=".2" />
              <stop offset="1" stopColor="#f66b50" stopOpacity="0" />
            </linearGradient>
          </defs>
          {Array.from({ length: 7 }, (_, i) => (
            <path
              key={i}
              d={`M0 ${210 - i * 14} Q80 ${240 - i * 19} 150 ${160 - i * 8} T280 ${130 + i * 6} T410 ${80 + i * 7} T600 ${55 + i * 6}`}
              fill="none"
              stroke={i === 0 ? "#f57356" : "#665452"}
              strokeWidth={i === 0 ? 2 : 1}
            />
          ))}
        </svg>
      )}
      <span className="art-corner">
        {kind === "housing"
          ? "12.97° N · 77.59° E"
          : "DATA → LOGIC → INTERFACE"}
      </span>
    </div>
  );
}
