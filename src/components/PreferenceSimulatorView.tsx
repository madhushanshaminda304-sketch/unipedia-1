import React from "react";
import {SavedCatalogue} from './PortalPages';
import { useApp } from "../context/AppContext";
import { cutoffLabel } from "../lib/discovery";
import { copy } from "../lib/ui";
import { Modal } from "./Modal";

export function PreferenceSimulatorContent() {
  const app = useApp(),
    c = copy(app.lang, app.cutoffYear);
  return (
    <>
      <p className="lead">{c.emptyPlanBody}</p>
      <p className="muted">
        This is a personal planning list, not an application or an admission
        prediction. Your preferred order is never changed automatically.
      </p>
      <p className="small muted">
        {c.local} {c.historical}
      </p>
      {!app.planEntries.length ? (
        <div className="empty-state">
          <h2>{c.emptyPlan}</h2>
          <p>{c.emptyPlanBody}</p>
          <button
            className="button primary"
            onClick={() => {
              app.setIsPlanDrawerOpen(false);
              app.setRoute("predictor");
            }}
          >
            {c.find}
          </button>
        </div>
      ) : (
        <>
          <div className="button-row no-print">
            <button className="button secondary" onClick={() => window.print()}>
              {c.print}
            </button>
            {app.planMigrationInfo.hasBackup && (
              <button
                className="text-link"
                onClick={app.restorePreMigrationPlan}
              >
                Restore saved backup
              </button>
            )}
          </div>
          <ol className="shortlist">
            {app.planEntries.map((entry, i) => {
              const p = app.districtPrograms.find(
                  (p) => p.uni_code === entry.uni_code,
                ),
                needsReview =
                  entry.migrationStatus && entry.migrationStatus !== "valid";
              return (
                <li key={`${entry.uni_code}-${i}`}>
                  <span className="rank">{i + 1}</span>
                  <div className="shortlist-course">
                    <span className="code">{entry.uni_code}</span>
                    <h2>
                      {p ? (
                        <button
                          className="text-link"
                          onClick={() => app.openCourseProfile(p.uni_code)}
                        >
                          {p.course_name}
                        </button>
                      ) : (
                        entry.originalCourseName || "Saved course needs review"
                      )}
                    </h2>
                    <p>
                      {p?.institution_name ||
                        "This code is not in the current catalog."}
                    </p>
                    {p && (
                      <p className="small muted">
                        {p.cutoff_year} · {p.district_name} · {cutoffLabel(p)}
                      </p>
                    )}
                    {needsReview && (
                      <div className="notice compact">
                        <strong>{c.review}</strong>
                        <p>
                          {entry.migrationNote ||
                            "This saved record needs checking against the current catalog."}
                        </p>
                        {entry.suggestedUniCode && (
                          <button
                            className="button secondary"
                            onClick={() =>
                              app.acceptPlanMigration(entry.uni_code)
                            }
                          >
                            Accept suggested code {entry.suggestedUniCode}
                          </button>
                        )}
                        <button
                          className="text-link"
                          onClick={() =>
                            app.dismissPlanMigrationFlag(entry.uni_code)
                          }
                        >
                          Keep this code and mark reviewed
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="order-controls no-print">
                    <button
                      className="icon-button"
                      disabled={i === 0}
                      aria-label={`${c.up}: ${p?.course_name || entry.uni_code}`}
                      onClick={() => app.movePlanItem(i, "up")}
                    >
                      ↑
                    </button>
                    <button
                      className="icon-button"
                      disabled={i === app.planEntries.length - 1}
                      aria-label={`${c.down}: ${p?.course_name || entry.uni_code}`}
                      onClick={() => app.movePlanItem(i, "down")}
                    >
                      ↓
                    </button>
                    <button
                      className="text-link danger"
                      aria-label={`${c.remove}: ${p?.course_name || entry.uni_code}`}
                      onClick={() => app.removeFromPlan(entry.uni_code)}
                    >
                      {c.remove}
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="notice">
            <p>
              Before submitting to UGC, confirm every Uni Code and requirement
              in the official handbook and current notices. Choose your order by
              what you want to study, not by which historical cutoff is highest.
            </p>
          </div>
        </>
      )}
    </>
  );
}
export function PreferenceSimulatorView() {
  const { lang } = useApp();
  return (
    <div className="premium-page premium-shortlist">
      <nav className="reference-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Saved choices</span></nav>
      <h1>{copy(lang).plan}</h1>
      <h2>UGC preference plan</h2>
      <PreferenceSimulatorContent />
      <SavedCatalogue />
    </div>
  );
}
export function PreferenceSimulatorDrawer() {
  const app = useApp();
  return (
    <Modal
      open={app.isPlanDrawerOpen}
      onClose={() => app.setIsPlanDrawerOpen(false)}
      title={copy(app.lang, app.cutoffYear).plan}
      wide
    >
      <PreferenceSimulatorContent />
    </Modal>
  );
}
