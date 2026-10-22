"use client";
import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import { photos } from "@/content/photos";

export function HeroPortrait() {
  const card = useRef<HTMLDivElement>(null);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const box = event.currentTarget.getBoundingClientRect();
    card.current?.style.setProperty(
      "--portrait-x",
      `${((event.clientX - box.left) / box.width - 0.5) * 7}deg`,
    );
    card.current?.style.setProperty(
      "--portrait-y",
      `${-((event.clientY - box.top) / box.height - 0.5) * 7}deg`,
    );
  }
  function reset() {
    card.current?.style.setProperty("--portrait-x", "0deg");
    card.current?.style.setProperty("--portrait-y", "0deg");
  }
  return (
    <div className="hero-portrait" onPointerMove={move} onPointerLeave={reset}>
      <div className="portrait-orbit" aria-hidden="true" />
      <div className="portrait-card" ref={card}>
        <div className="portrait-image">
          <Image
            src={photos[0].src}
            alt={photos[0].alt}
            fill
            sizes="(max-width: 700px) 80vw, (max-width: 1000px) 36vw, 380px"
            preload
          />
        </div>
        <div className="portrait-signature">
          <span className="micro">THE PERSON BEHIND THE CODE</span>
          <strong>
            Hanamaraddi<span className="accent">.</span>
          </strong>
          <span className="portrait-discipline">AI & Data Science · BMSCE</span>
        </div>
        <span className="portrait-corner" aria-hidden="true">
          ↗
        </span>
      </div>
      <span className="portrait-index micro">01 / A MIND IN THE MAKING</span>
    </div>
  );
}

export function PhotoGallery() {
  const [active, setActive] = useState(1);
  const photo = photos[active];
  return (
    <div className="photo-gallery">
      <figure>
        <div
          className={`gallery-image ${photo.fit === "contain" ? "full-portrait" : ""}`}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 700px) 88vw, 400px"
            style={{ objectFit: photo.fit, objectPosition: photo.position }}
          />
        </div>
        <figcaption>
          <span aria-live="polite">{photo.label}</span>
          <span className="micro">0{active + 1} / 03</span>
        </figcaption>
      </figure>
      <div className="photo-selectors" aria-label="Choose a portrait">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            aria-pressed={active === i}
            aria-label={`Show ${p.label.toLowerCase()}`}
            onClick={() => setActive(i)}
          >
            <Image
              src={p.src}
              alt=""
              width={48}
              height={48}
              style={{ objectFit: "cover", objectPosition: p.position }}
            />
            <span>
              {i === 0 ? "Portrait" : i === 1 ? "In person" : "Full frame"}
            </span>
          </button>
        ))}
      </div>
      <p className="photo-footnote">
        A few frames from the person behind the projects.
      </p>
    </div>
  );
}
