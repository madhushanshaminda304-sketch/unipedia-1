import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import type { ActiveRoute } from "../context/AppContext";
import { Modal } from "./Modal";
export function InformationView({ page }: { page: ActiveRoute }) {
  const app = useApp(),
    [reset, setReset] = useState(false),
    [report, setReport] = useState("");
  const copyReport = async () => {
    const text = `UniPedia data correction\nPage: ${location.origin}${location.pathname}\nRequirements year: 2025/2026\nCutoff year: ${app.cutoffYear}\nCourse / Uni Code:\nHandbook section and printed page:\nCurrent value:\nCorrect value and official source:\n`;
    try {
      await navigator.clipboard.writeText(text);
      setReport(
        "Correction template copied. This tool does not submit reports. You can also prepare a downloadable report on the Feedback & corrections page.",
      );
    } catch {
      setReport(text);
    }
  };
  return (
    <div className="premium-page prose-page">
      {page === "privacy" ? (
        <>
          <p className="eyebrow">Your information</p>
          <h1>Privacy & device storage</h1>
          <p>
            Your district, selected stream, academic details, shortlist and
            comparison choices are saved in this browser’s local storage. This
            does not create an account or sync them between devices. Other
            people using this browser profile may see those details.
          </p>
          <p>
            The redesigned study tools do not submit your grades, Z score or
            shortlist to a server. Filtered sharing links include the search,
            stream, medium and district only. Printing creates a local browser
            print job.
          </p>
          <p>
            The site requests web fonts from Google Fonts. Your hosting provider
            and external sites you choose to visit may process ordinary request
            information, such as your IP address. This app has no analytics
            tracking enabled in these tools.
          </p>
          <p>
            Clearing browser data can remove your saved choices. Earlier
            versions may have stored a saved plan backup on this device.
          </p>
          <button className="button secondary" onClick={() => setReset(true)}>
            Clear UniPedia data on this device
          </button>
          <Modal
            open={reset}
            onClose={() => setReset(false)}
            title="Clear saved data?"
          >
            <p>
              This removes your UniPedia profile, shortlist, comparison and
              older saved backups from this browser. This cannot be undone.
            </p>
            <div className="button-row">
              <button
                className="button secondary"
                onClick={() => setReset(false)}
              >
                Cancel
              </button>
              <button
                className="button primary"
                onClick={() => {
                  try {
                    Object.keys(localStorage)
                      .filter((k) => /^(unipedia_|lankavuz_)/.test(k))
                      .forEach((k) => localStorage.removeItem(k));
                    location.assign("/");
                  } catch {
                    setReport(
                      "Browser storage could not be cleared. Use your browser’s site data settings.",
                    );
                    setReset(false);
                  }
                }}
              >
                Clear saved data
              </button>
            </div>
          </Modal>
        </>
      ) : page === "terms" ? (
        <>
          <p className="eyebrow">Using UniPedia</p>
          <h1>Terms of use</h1>
          <p>
            UniPedia is an independent educational planning project. It is not
            operated by UGC or a university and does not submit applications or
            make admission decisions.
          </p>
          <p>
            Use the material as a starting point. Confirm requirements,
            deadlines, fees, recognition and selection results with the official
            authority before acting. Historical cutoffs cannot guarantee future
            selection.
          </p>
          <p>
            Automated checks cover only supported academic rules. Conditions
            such as examination sittings, attempts, citizenship, previous
            admissions, aptitude tests and exceptions can require individual
            review.
          </p>
          <p>
            External resources have their own terms. No payment, scholarship,
            loan approval, salary or employment outcome is promised here.
          </p>
        </>
      ) : (
        <>
          <p className="eyebrow">Independent student planning</p>
          <h1>About UniPedia & its sources</h1>
          <p>
            UniPedia helps Sri Lankan students explore study options, compare
            handbook requirements and organize their own shortlist.
          </p>
          <p>UniPedia is an independent student planning site.</p>
          <h2>Choose the cutoff admission year</h2>
          <p>
            <strong>2025/2026:</strong> course offerings, requirements and
            proposed intakes from that edition of the UGC handbook.
          </p>
          <p>
            <strong>2025/2026 cutoffs:</strong> the default selection snapshot
            comes from UGC’s separate official release dated 31 July 2026, based
            on the 2025 A/L examination after re-scrutiny. It contains 260
            stream/course/institution columns and 6,500 district cells covering
            255 selectable offerings.
          </p>
          <p>
            <strong>2024/2025 cutoffs:</strong> the previous snapshot comes from
            Section 9 of the attached 2025/2026 handbook and is based on 2024
            A/L results. The handbook’s edition year is not the year of its
            cutoff tables. Both snapshots remain available; the year selector
            controls which one you see.
          </p>
          <a
            href="https://www.ugc.ac.lk/downloads/admissions/cutoff_2026/COP_2025_2026-ENGLISH_Final.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Official 2025/2026 cutoff PDF ↗
          </a>
          <h2>Data sources and verification</h2>
          <p>Check the official UGC handbook for entry requirements before applying.</p>
          <details>
            <summary>How we prepare and verify the data</summary>
            <p>
              We transcribed the handbook with Gemini and NotebookLM assistance
              and checked the resulting records against that transcription.
              A review of the requirements against the original PDF is still pending.
            </p>
            <p>
              The 2025/2026 cutoffs come directly from the official UGC release.
              We cross-checked all 6,500 district cells and matched the course
              headings to the current catalogue.
            </p>
            <p>
              Navigation and common finder controls are available in English,
              Sinhala and Tamil. Detailed guidance and handbook text are in English.
            </p>
          </details>
          <p>
            The current catalog contains 121 active courses and 255 selectable
            Uni Code offerings. Separate campuses retain separate identifiers.
            Suspended courses and the Additional Intake aggregate are not
            offered as selectable choices.
          </p>
          <h2>What the results mean</h2>
          <p>
            Numeric cutoffs retain their published precision, including negative
            values. NQC, absent history and stream category splits are kept
            distinct. Unknown information stays unknown.
          </p>
          <p>
            “Academic requirements match” means the entered details passed the
            supported academic checks. It is not a complete eligibility or
            admission decision. Rules requiring manual interpretation stay
            marked “Further checking needed”.
          </p>
          <h2>Report a possible error</h2>
          <p><a href="/contact">Prepare a feedback or correction report</a></p>
          <p>
            Include the Uni Code, handbook edition, section, printed page and
            the official source showing the correction. Avoid sharing your
            personal exam details.
          </p>
          <button className="button secondary" onClick={copyReport}>
            Copy a correction template
          </button>
          <p className="small muted">
            There is no submission service connected to this button.
          </p>
          <a href="https://www.ugc.ac.lk/" target="_blank" rel="noreferrer">
            Open the official UGC website ↗
          </a>
        </>
      )}
      {report && (
        <p className="notice source-prose" role="status">
          {report}
        </p>
      )}
    </div>
  );
}
