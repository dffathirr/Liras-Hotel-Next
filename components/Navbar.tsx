'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Beranda',   href: '/' },
  { label: 'Kamar',     href: '/kamar' },
  { label: 'Tentang',   href: '/about' },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <nav className={`liras-navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container">
          {/* Logo */}
          <Link href="/" className="liras-navbar__brand">
            <div>
              <span className="liras-navbar__logo-text">LIRAS</span>
              <span className="liras-navbar__logo-sub">Hotel &amp; Resort</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <ul className="liras-navbar__nav">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`liras-navbar__nav-link${pathname === link.href ? ' active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA + hamburger */}
          <div className="liras-navbar__cta">
            <Link href="/booking" className="liras-btn-book">
              Pesan Sekarang
            </Link>
          </div>

          <button
            className="liras-navbar__toggler"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`liras-navbar__mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="container">
          <ul className="liras-navbar__mobile-nav">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={pathname === link.href ? 'active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/booking" className="liras-btn-book liras-navbar__mobile-book">
            Pesan Sekarang
          </Link>
        </div>
      </div>
    </>
  );
}
