"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <Link className="brand" href="/" aria-label="Hanamaraddi home">
        h<span>k.</span>
      </Link>
      <span className="brand-caption">
        HANAMARADDI
        <br />
        KANAKANNAVAR
      </span>
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="navigation"
        aria-label={open ? "Close navigation" : "Open navigation"}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav
        id="navigation"
        className={open ? "nav open" : "nav"}
        onClick={() => setOpen(false)}
      >
        <Link href="/#work">Work</Link>
        <Link href="/#about">About</Link>
        <Link href="/#expertise">Toolkit</Link>
        <Link href="/resume">Resume</Link>
        <Link
          href="/#contact"
          className="nav-contact"
          data-event="contact_click"
        >
          Let’s talk <ArrowUpRight size={15} />
        </Link>
      </nav>
    </header>
  );
}
