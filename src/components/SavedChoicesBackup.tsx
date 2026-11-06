import React, { useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { usePortal } from "../context/PortalContext";
import { discoveryProgrammes } from "../lib/portal";
import {
  createSavedChoicesBackup, parseSavedChoices, MAX_BACKUP_BYTES,
  type SavedChoicesBackup as Backup,
} from "../lib/savedChoicesBackup";
import { Modal } from "./Modal";

export function SavedChoicesBackup() {
  const app = useApp(), portal = usePortal();
  const input = useRef<HTMLInputElement>(null);
  const request = useRef(0);
  const [preview, setPreview] = useState<Backup | null>(null);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const programmes = discoveryProgrammes();
  const name = (kind: "ugc" | "catalogue", id: string) =>
    programmes.find((p) => p.ref.kind === kind && p.ref.id === id)?.title;
  const download = () => {
    setError(""); setMessage("");
    try {
      const backup = createSavedChoicesBackup(app.planEntries, portal.saved);
      const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `unipedia-saved-choices-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      try { link.click(); } finally { link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
      setMessage("Backup download started. It contains programme IDs only, with UGC preferences in order.");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not download saved choices. Please try again."); }
  };
  const readFile = async (file: File) => {
    const current = ++request.current;
    setPreview(null); setError(""); setMessage(""); setReading(true);
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error("The backup must be smaller than 1 MB.");
      const backup = parseSavedChoices(await file.text());
      if (current === request.current) setPreview(backup);
    } catch (e) {
      if (current === request.current)
        setError(e instanceof Error ? e.message : "Could not read this file. Existing choices have not changed.");
    } finally { if (current === request.current) setReading(false); }
  };
  const restore = () => {
    if (!preview) return;
    setError("");
    try {
      portal.restoreSavedChoices(preview);
      setPreview(null);
      setMessage(`Restored ${preview.ugcProgrammeIds.length} UGC choices and ${preview.otherProgrammeIds.length} other-programme choices. UGC order is preserved; unavailable IDs remain labelled in your lists.`);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not restore saved choices."); }
  };
  const unavailable = preview ? [
    ...preview.ugcProgrammeIds.filter((id) => !name("ugc", id)).map((id) => `UGC: ${id}`),
    ...preview.otherProgrammeIds.filter((id) => !name("catalogue", id)).map((id) => `Other programmes: ${id}`),
  ] : [];
  return (
    <section className="notice no-print" aria-label="Saved choices backup">
      <h2>Back up your choices</h2>
      <p>Download your ordered UGC choices and saved other programmes. Grades, Z-score, district and academic profile details are excluded. Keep the file somewhere safe; it is not uploaded.</p>
      <div className="button-row">
        <button className="button secondary" onClick={download}>Download saved choices</button>
        <button className="button secondary" disabled={reading} onClick={() => input.current?.click()}>
          {reading ? "Reading backup…" : "Restore saved choices"}
        </button>
        <input ref={input} type="file" accept=".json,application/json" hidden aria-label="Saved choices backup file"
          onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; if (file) void readFile(file); }} />
      </div>
      <p className="small muted">Restoring replaces both lists after confirmation. Comparison selections are unchanged. Existing locks and review notes are retained for matching UGC IDs; new IDs start unlocked.</p>
      {message && <p role="status">{message}</p>}
      {error && !preview && <p role="alert">{error}</p>}
      <Modal open={!!preview} onClose={() => { setPreview(null); setError(""); }} title="Review saved choices backup" wide>
        {preview && <>
          <p>{preview.ugcProgrammeIds.length} UGC choices · {preview.otherProgrammeIds.length} other-programme choices · {unavailable.length} unavailable IDs</p>
          <p>This will replace your current {app.planEntries.length} UGC choices and {portal.saved.length} other-programme choices, including when a backup list is empty. Download your current choices first if you want to keep a copy.</p>
          {!!unavailable.length && <div className="notice"><strong>Unavailable programmes</strong><p>These IDs will be kept and labelled unavailable. They cannot be used as current programme links.</p><ul>{unavailable.map((id) => <li key={id}>{id}</li>)}</ul></div>}
          <details><summary>UGC preference order</summary><ol>{preview.ugcProgrammeIds.map((id) => <li key={id}>{id} · {name("ugc", id) || "Unavailable programme"}</li>)}</ol></details>
          <details><summary>Saved other programmes</summary><ul>{preview.otherProgrammeIds.map((id) => <li key={id}>{id} · {name("catalogue", id) || "Unavailable programme"}</li>)}</ul></details>
          {error && <p role="alert">{error}</p>}
          <div className="button-row">
            <button className="button secondary" onClick={() => { setPreview(null); setError(""); }}>Cancel</button>
            <button className="button primary" onClick={restore}>Replace saved choices</button>
          </div>
        </>}
      </Modal>
    </section>
  );
}
