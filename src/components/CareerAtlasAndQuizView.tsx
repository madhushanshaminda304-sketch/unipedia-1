import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ProgramChanceCard } from "./ProgramChanceCard";
const interests = [
  {
    name: "Technology & building",
    description: "Computing, engineering and practical systems",
    words:
      /comput|engineering|technology|artificial intelligence|data science|software|information systems/i,
  },
  {
    name: "Health & living things",
    description: "Health, animals, agriculture and the environment",
    words:
      /medicine|nursing|pharmacy|health|dental|biolog|agricultur|veterinary|environment|food/i,
  },
  {
    name: "Business & numbers",
    description: "Organizations, finance and quantitative work",
    words:
      /management|business|account|finance|commerce|econom|statistic|mathematic/i,
  },
  {
    name: "People & society",
    description: "Communities, communication and public life",
    words:
      /law|arts|social|communication|education|peace|tourism|translation|language/i,
  },
  {
    name: "Creative work",
    description: "Design, visual expression and performance",
    words:
      /design|art|music|drama|dance|dancing|architecture|landscape|film|visual/i,
  },
];
export function CareerAtlasAndQuizView(_props: {
  initialTab?: "atlas" | "quiz";
}) {
  const app = useApp(),
    [selected, setSelected] = useState<string[]>([]);
  const matches = selected.length
    ? app.districtPrograms
        .filter((p) =>
          interests.some(
            (i) => selected.includes(i.name) && i.words.test(p.course_name),
          ),
        )
        .slice()
        .sort((a, b) => a.course_name.localeCompare(b.course_name))
    : [];
  return (
    <div className="page">
      <p className="eyebrow">Start with what interests you</p>
      <h1>Explore study interests</h1>
      <p className="lead">
        Choose areas you would like to explore. You can choose more than one.
      </p>
      <p className="muted">
        This is a browsing guide based on course titles. It is not a personality
        assessment, career prediction or eligibility decision.
      </p>
      <div className="interest-grid">
        {interests.map((i) => (
          <button
            key={i.name}
            className={`interest-button ${selected.includes(i.name) ? "selected" : ""}`}
            aria-pressed={selected.includes(i.name)}
            onClick={() =>
              setSelected((prev) =>
                prev.includes(i.name)
                  ? prev.filter((x) => x !== i.name)
                  : [...prev, i.name],
              )
            }
          >
            <strong>{i.name}</strong>
            <span>{i.description}</span>
            <small>
              {selected.includes(i.name) ? "✓ Selected" : "Explore this area →"}
            </small>
          </button>
        ))}
      </div>
      {selected.length ? (
        <section className="section">
          <h2>{matches.length} course offerings to explore</h2>
          <p className="muted">
            Suggested by interest. Read the official academic requirements for
            each course separately.
          </p>
          <div className="course-grid institution-courses">
            {matches.map((p) => (
              <ProgramChanceCard
                key={p.uni_code}
                program={p}
                studentZ={app.studentZScore}
              />
            ))}
          </div>
          {!matches.length && (
            <button
              className="button primary"
              onClick={() => app.setRoute("predictor")}
            >
              Browse all courses
            </button>
          )}
        </section>
      ) : (
        <div className="empty-state">
          <h2>What would you like to learn about?</h2>
          <p>Select an area above to see related courses.</p>
        </div>
      )}
    </div>
  );
}
