import React from "react";
export function AdmissionGuidance() {
  return (
    <details className="admission-guide">
      <summary>How subjects, Z scores and selection work</summary>
      <div className="guidance-grid">
        <section>
          <h2>First check the entry requirements</h2>
          <p>
            A high Z score does not replace required subjects. For example,
            Medicine requires Biology, Chemistry and Physics with at least two C
            grades and one S grade. Other programmes accept broader
            combinations. O/L grades, General Paper marks and aptitude tests can
            also apply.
          </p>
        </section>
        <section>
          <h2>Then compare the selection cutoff</h2>
          <p>
            Z scores rank candidates who satisfy the relevant requirements.
            District, available places, preferences and the applicable merit or
            quota rules also affect selection. Some programmes use all island
            merit. A previous cutoff is a reference, not a reason to avoid
            applying for an eligible course you prefer.
          </p>
        </section>
        <section>
          <h2>Browse freely, check details when ready</h2>
          <p>
            You can browse without entering subjects. Choosing a stream selects
            a cutoff category where needed; it does not limit the catalog unless
            you enable the separate stream section filter. The optional academic
            filter hides only confirmed mismatches and keeps uncertain cases
            visible.
          </p>
        </section>
      </div>
      <p className="small muted">
        Sources: UGC Handbook 2025/2026, Sections 1.1–1.4 and 2.2; extracted
        handbook files ugc1.md and course requirements. General sitting, attempt
        and registration conditions still need individual checking.
      </p>
      <a
        href="https://www.ugc.ac.lk/downloads/admissions/Handbook_2025_26/student_handbook_english.pdf"
        target="_blank"
        rel="noreferrer"
      >
        Read the official handbook ↗
      </a>
    </details>
  );
}
