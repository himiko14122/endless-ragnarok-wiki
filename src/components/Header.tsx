'use client';

import { ChevronDown, Menu, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { NAVIGATION_CONFIG } from '@/config/navigation';
import { localeNames, routing, type Locale } from '@/i18n/routing';
import { Link, usePathname } from '@/i18n/navigation';
import ThemeToggle from './ThemeToggle';

type NavDropdownItem = { label: string; path: string };
type NavDropdownMap = Record<string, NavDropdownItem[]>;

export default function Header({ navDropdownItems = {} }: { navDropdownItems?: NavDropdownMap }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navItems = NAVIGATION_CONFIG.filter((item) => item.showInHeader);

  useEffect(() => {
    const saved = sessionStorage.getItem('scrollY');
    if (saved) {
      sessionStorage.removeItem('scrollY');
      requestAnimationFrame(() => window.scrollTo(0, Number(saved)));
    }
  }, []);

  const closeMobile = () => {
    setMobileOpen(false);
    setExpandedKey(null);
  };

  const handleMouseEnter = (key: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredKey(key);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setHoveredKey(null), 150);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold font-[var(--font-heading)] gradient-text whitespace-nowrap">
            ENDLESS RAGNAROK WIKI
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
              const dropdown = navDropdownItems[item.key];
              const hasDropdown = dropdown && dropdown.length > 0;
              const isHovered = hoveredKey === item.key;
              const isContentType = 'isContentType' in item && item.isContentType;

              return (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => hasDropdown && handleMouseEnter(item.key)}
                  onMouseLeave={() => hasDropdown && handleMouseLeave()}
                >
                  <Link
                    href={item.path}
                    className={`text-sm px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1 ${isActive ? 'text-[var(--color-accent)] font-semibold bg-[var(--color-accent)]/10' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.04]'}`}
                  >
                    {t(item.labelKey)}
                    {hasDropdown && <ChevronDown size={14} className={`transition-transform ${isHovered ? 'rotate-180' : ''}`} />}
                  </Link>

                  {hasDropdown && isHovered && (
                    <div className="absolute left-0 top-full pt-2 w-80">
                      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-xl overflow-hidden">
                        <div className="max-h-[28rem] overflow-y-auto py-1">
                          {dropdown.slice(0, 8).map((sub) => (
                            <Link
                              key={sub.path}
                              href={sub.path}
                              className="block px-4 py-2 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg-hover)] transition-colors leading-relaxed"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-[var(--color-border)]">
                          <Link
                            href={item.path}
                            className="block px-4 py-2.5 text-xs font-semibold text-[var(--color-accent)] hover:bg-[var(--color-bg-hover)] transition-colors"
                          >
                            {t(`category_articles_${item.key}`)} →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                aria-label="Switch language"
              >
                {locale.toUpperCase()}
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-xl z-50">
                  {routing.locales.map((item) => (
                    <Link
                      key={item}
                      href={pathname || '/'}
                      locale={item}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors first:rounded-t-lg last:rounded-b-lg"
                      onClick={() => { setLangOpen(false); sessionStorage.setItem('scrollY', String(window.scrollY)); }}
                    >
                      {localeNames[item]}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button className="lg:hidden p-2 text-[var(--color-text-secondary)]" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden pb-4 border-t border-[var(--color-border)] pt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
              const dropdown = navDropdownItems[item.key];
              const hasDropdown = dropdown && dropdown.length > 0;
              const isExpanded = expandedKey === item.key;

              return (
                <div key={item.key}>
                  <div className="flex items-center">
                    <Link
                      href={item.path}
                      className={`flex-1 block py-2 px-3 rounded-md text-sm transition-colors ${isActive ? 'text-[var(--color-accent)] font-semibold bg-[var(--color-accent)]/10' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
                      onClick={() => !hasDropdown && closeMobile()}
                    >
                      {t(item.labelKey)}
                    </Link>
                    {hasDropdown && (
                      <button
                        className="p-2 text-[var(--color-text-secondary)]"
                        onClick={() => setExpandedKey(isExpanded ? null : item.key)}
                      >
                        <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  {hasDropdown && isExpanded && (
                    <div className="ml-4 border-l border-[var(--color-border)]">
                      {dropdown.slice(0, 8).map((sub) => (
                        <Link
                          key={sub.path}
                          href={sub.path}
                          className="block py-1.5 px-3 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors leading-relaxed"
                          onClick={() => closeMobile()}
                        >
                          {sub.label}
                        </Link>
                      ))}
                      <Link
                        href={item.path}
                        className="block py-1.5 px-3 text-xs font-semibold text-[var(--color-accent)] hover:underline"
                        onClick={() => setMobileOpen(false)}
                      >
                        {t(`category_articles_${item.key}`)} →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
