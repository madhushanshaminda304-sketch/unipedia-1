import React from "react";
import { useApp } from "../context/AppContext";
import type { CutoffYear } from "../services/ugcAdapter";
export function CutoffEditionSelect() {
  const app = useApp();
  return (
    <label className="field cutoff-edition">
      Cutoff admission year
      <select
        value={app.cutoffYear || "2025/2026"}
        onChange={(e) => app.setCutoffYear(e.target.value as CutoffYear)}
      >
        <option value="2025/2026">2025/2026 · 2025 A/L · latest loaded</option>
        <option value="2024/2025">2024/2025 · 2024 A/L · previous</option>
      </select>
    </label>
  );
}
