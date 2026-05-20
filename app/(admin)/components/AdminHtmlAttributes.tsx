'use client';

import { useEffect } from 'react';

export default function AdminHtmlAttributes() {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-nav-layout', 'vertical');
    html.setAttribute('data-theme-mode', 'light');
    html.setAttribute('data-header-styles', 'light');
    html.setAttribute('data-menu-styles', 'light');
    html.setAttribute('data-toggled', 'close');

    return () => {
      html.removeAttribute('data-nav-layout');
      html.removeAttribute('data-theme-mode');
      html.removeAttribute('data-header-styles');
      html.removeAttribute('data-menu-styles');
      html.removeAttribute('data-toggled');
    };
  }, []);

  return null;
}
