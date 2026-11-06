import React from "react";
import type { DiscoveryProgramme } from "../lib/portal";
import { ProgrammeActions } from "./PortalPrimitives";
import { InstitutionVisual } from "./InstitutionVisual";
export function ProgrammeDirectoryRow({
  programme: p,
}: {
  programme: DiscoveryProgramme;
}) {
  return (
    <article className="catalogue-programme-row">
      <div className="catalogue-programme-identity">
        <InstitutionVisual id={p.institutionId} name={p.institution} />
        <div>
          <a className="catalogue-institution-name" href={p.institutionHref}>
            {p.institution}
          </a>
          <h2>
            <a href={p.href}>{p.title}</a>
          </h2>
          <div className="opportunity-tags">
            <span>{p.level}</span>
            <span>{p.duration}</span>
          </div>
          <p className="row-awarding-body">Awarding body reported: {p.award}</p>
        </div>
      </div>
      <div className="catalogue-row-fee">
        <small>Reported fee & payment basis</small>
        <p>{p.fee}</p>
        {p.source?.fee_notes && (
          <small>
            Fee notes and caveats are available in programme details.
          </small>
        )}
      </div>
      <div className="catalogue-row-actions">
        <a className="button primary" href={p.href}>
          View details
        </a>
        <ProgrammeActions programme={p} />
      </div>
    </article>
  );
}
