import Link from "next/link";
import { Gamepad2 } from "lucide-react";

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
              <Gamepad2 className="size-5" />
            </span>
            <span>Micro / Meso / Macro</span>
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
