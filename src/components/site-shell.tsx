import Link from "next/link";

import { SkillcheckMark } from "@/components/skillcheck-mark";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <nav className="site-nav" aria-label="Main navigation">
          <Link className="brand-lockup" href="/">
            <span className="brand-mark">
              <SkillcheckMark />
            </span>
            <span className="brand-name">Skillcheck</span>
          </Link>
          <div className="nav-links">
            <Link href="/test">Test</Link>
            <Link href="/database">Database</Link>
          </div>
        </nav>
      </header>
      <main id="main-content">{children}</main>
    </>
  );
}
