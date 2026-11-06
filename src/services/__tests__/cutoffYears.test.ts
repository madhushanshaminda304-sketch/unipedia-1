import { describe, expect, it } from "vitest";
import latest from "../../data/ugc/cutoffs2025.json";
import {
  getCutoffForOfferingAndDistrict,
  getProgramCutoffRowsForDistrict,
  getAllDistrictCutoffsForUniCode,
  getDatasetSummaryCounts,
} from "../ugcAdapter";

describe("Official 2025/2026 cutoffs and previous-year isolation", () => {
  it("defaults every public lookup to the new release and retains the previous year", () => {
    expect(getCutoffForOfferingAndDistrict("001A", 1).min_z_score).toBe(2.2721);
    expect(
      getCutoffForOfferingAndDistrict("001A", 1, undefined, "2024/2025")
        .min_z_score,
    ).toBe(2.3517);
    expect(getAllDistrictCutoffsForUniCode("001A")[0].min_z_score).toBe(2.2721);
    const row = getProgramCutoffRowsForDistrict(1).find(
      (p) => p.uni_code === "001A",
    )!;
    expect(row.cutoff_year).toBe("2025/2026");
    expect(row.source_reference.cutoff_source_url).toBe(latest.source_url);
    expect(getDatasetSummaryCounts().totalCutoffCells).toBe(6500);
    expect(getDatasetSummaryCounts("2024/2025").totalCutoffCells).toBe(6650);
  });
  it("covers exactly 255 selectable offerings and retains NQC and negative scores", () => {
    const cells = latest.columns.flatMap((c) => c.district_cutoffs);
    expect(latest.columns).toHaveLength(260);
    expect(new Set(latest.columns.map((c) => c.uni_code_2025_2026)).size).toBe(
      255,
    );
    expect(cells).toHaveLength(6500);
    expect(cells.filter((c) => c.is_nqc)).toHaveLength(1026);
    expect(
      cells.filter((c) => c.z_score !== null && c.z_score < 0),
    ).toHaveLength(55);
    expect(getCutoffForOfferingAndDistrict("023G", 15).min_z_score).toBe(
      -0.2638,
    );
  });
  it("maps all 6500 extracted cells through the adapter without mixing years or categories", () => {
    for (const col of latest.columns) {
      const q = col.stream_or_category_qualifier?.toLowerCase() || "";
      const stream = q.includes("commerce")
        ? "Commerce"
        : q.includes("bio") || q.includes("physical")
          ? "Biological Science"
          : q.includes("other")
            ? "Physical Science"
            : q.includes("any")
              ? "Arts"
              : q.includes("arts")
                ? "Arts"
                : undefined;
      for (const cell of col.district_cutoffs) {
        const actual = getCutoffForOfferingAndDistrict(
          col.uni_code_2025_2026!,
          cell.district_id,
          stream,
          "2025/2026",
        );
        expect(
          actual.min_z_score,
          `${col.column_id} ${cell.district_name}`,
        ).toBe(cell.z_score);
        expect(actual.raw_value).toBe(cell.raw_value);
        expect(actual.status).toBe(cell.is_nqc ? "NQC" : "QUALIFIED");
      }
    }
  });
  it("uses explicit current Sports Science and new-course mappings without reusing ambiguous old data", () => {
    expect(getCutoffForOfferingAndDistrict("141D", 1).min_z_score).toBe(0.7496);
    expect(
      getCutoffForOfferingAndDistrict("141D", 1, undefined, "2024/2025").status,
    ).toBe("NO_HISTORICAL_CUTOFF");
    expect(getCutoffForOfferingAndDistrict("142F", 1).min_z_score).toBe(1.7818);
    expect(getCutoffForOfferingAndDistrict("143B", 1).min_z_score).toBe(1.9867);
  });
});
