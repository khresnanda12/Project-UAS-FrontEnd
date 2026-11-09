
"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/format";
import { NAV_LINKS } from "./content";
import { useLanding } from "./context";

export function Navbar() {
  const { openOrder } = useLanding();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>(NAV_LINKS[0].id);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);

      const line = 140;
      let current: string = NAV_LINKS[0].id;
      let closestTop = -Infinity;

      // Tentukan section aktif berdasarkan posisi,
      // bukan urutan navbar.
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);

        if (el) {
          const top = el.getBoundingClientRect().top;

          if (top <= line && top > closestTop) {
            closestTop = top;
            current = link.id;
          }
        }
      }

      setActive(current);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    window.addEventListener("hashchange", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onScroll);
    };
  }, []);

  return (
    <nav
      className={cx("navbar", scrolled && "scrolled")}
      aria-label="Navigasi utama"
    >
      <a
        href="#beranda"
        className="logo"
        onClick={() => setActive("beranda")}
      >
        LAMAK BANA
      </a>

      <ul
        className={cx("nav-links", menuOpen && "open")}
        id="navLinks"
      >
        {NAV_LINKS.map((l) => (
          <li key={l.id}>
            <a
              href={`#${l.id}`}
              className={
                active === l.id ? "active-link" : undefined
              }
              aria-current={
                active === l.id ? "location" : undefined
              }
              onClick={() => {
                setActive(l.id);
                setMenuOpen(false);
              }}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="btn-pesan"
        onClick={() => openOrder()}
      >
        Pesan Sekarang
      </button>

      <button
        type="button"
        className={cx(
          "nav-toggle",
          menuOpen && "open"
        )}
        aria-label={
          menuOpen ? "Tutup menu" : "Buka menu"
        }
        aria-expanded={menuOpen}
        aria-controls="navLinks"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}
