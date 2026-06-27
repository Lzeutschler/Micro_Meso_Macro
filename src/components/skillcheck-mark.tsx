import { Cpu, Crosshair, Eye } from "lucide-react";

export function SkillcheckMark({ size = "default" }: { size?: "default" | "large" }) {
  return (
    <span className={`skillcheck-mark ${size === "large" ? "large" : ""}`} aria-hidden="true">
      <svg className="skillcheck-logo" viewBox="0 0 172 148" focusable="false">
        <g className="skillcheck-logo-shadow" transform="translate(7 8)">
          <circle cx="62" cy="52" r="43" />
          <circle cx="110" cy="52" r="43" />
          <circle cx="86" cy="93" r="43" />
        </g>

        <g className="skillcheck-logo-cells">
          <circle className="skillcheck-cell micro" cx="62" cy="52" r="43" />
          <circle className="skillcheck-cell macro" cx="110" cy="52" r="43" />
          <circle className="skillcheck-cell meso" cx="86" cy="93" r="43" />
        </g>

        <path className="skillcheck-core" d="M86 47 107 59 107 83 86 95 65 83 65 59Z" />
        <path className="skillcheck-check" d="m75 70 8 8 18-22" />

        <g className="skillcheck-logo-icons">
          <rect className="skillcheck-icon-plate" x="36" y="34" width="32" height="32" transform="rotate(45 52 50)" />
          <Crosshair className="skillcheck-glyph" x="40" y="38" width="24" height="24" />

          <rect className="skillcheck-icon-plate" x="104" y="34" width="32" height="32" transform="rotate(45 120 50)" />
          <Cpu className="skillcheck-glyph" x="108" y="38" width="24" height="24" />

          <rect className="skillcheck-icon-plate" x="70" y="99" width="32" height="32" transform="rotate(45 86 115)" />
          <Eye className="skillcheck-glyph" x="74" y="103" width="24" height="24" />
        </g>
      </svg>
    </span>
  );
}
