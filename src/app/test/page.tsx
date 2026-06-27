import { SiteShell } from "@/components/site-shell";
import { QuizFlow } from "@/components/quiz-flow";

export const metadata = {
  title: "Test | Skillcheck",
};

export default function TestPage() {
  return (
    <SiteShell>
      <QuizFlow />
    </SiteShell>
  );
}
