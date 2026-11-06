import React from "react";
import type { SourceReference } from "../data/ugc/types";
export function SourceCitation({ source }: { source?: SourceReference }) {
  if (!source) return <p>Requirement source reference unavailable.</p>;
  return (
    <p className="small muted">
      Requirement source: {source.source_file} · {source.source_section}
      {source.printed_page ? ` · printed page ${source.printed_page}` : ""}
      {source.source_line_start
        ? ` · lines ${source.source_line_start}–${source.source_line_end}`
        : ""}
      . Original PDF review pending.
    </p>
  );
}
