import { SiteShell } from "@/components/site-shell";
import { QuizFlow } from "@/components/quiz-flow";

export const metadata = {
  title: "Take the test | Micro / Meso / Macro",
};

export default function TestPage() {
  return (
    <SiteShell>
      <QuizFlow />
    </SiteShell>
  );
}
