import { DatabaseBrowser } from "@/components/database-browser";
import { SiteShell } from "@/components/site-shell";

export const metadata = {
  title: "Database | Micro / Meso / Macro",
};

export default function DatabasePage() {
  return (
    <SiteShell>
      <DatabaseBrowser />
    </SiteShell>
  );
}
