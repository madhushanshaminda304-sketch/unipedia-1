import React, { useState } from "react";
export function DegreeRoiCalculator() {
  const [tuition, setTuition] = useState(""),
    [months, setMonths] = useState(""),
    [living, setLiving] = useState(""),
    [other, setOther] = useState("");
  const ready =
    [tuition, months, living, other].every(
      (v) => v.trim() !== "" && Number.isFinite(Number(v)) && Number(v) >= 0,
    ) &&
    Number.isInteger(Number(months)) &&
    Number(months) > 0;
  const total =
    Number(tuition) + Number(months) * Number(living) + Number(other);
  return (
    <section className="cost-planner">
      <h2>Plan your study budget</h2>
      <p className="muted">
        Enter your own estimates in LKR. No fees, grants, salary or loan
        approval are assumed.
      </p>
      <div className="budget-fields">
        {[
          {
            label: "Total tuition for the whole course",
            value: tuition,
            set: setTuition,
          },
          { label: "Months of study", value: months, set: setMonths },
          {
            label: "Monthly living and travel costs",
            value: living,
            set: setLiving,
          },
          { label: "Other total costs", value: other, set: setOther },
        ].map((f) => (
          <label className="field" key={f.label}>
            {f.label}
            <input
              type="number"
              min="0"
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
            />
          </label>
        ))}
      </div>
      <output className="budget-total" aria-live="polite">
        {ready
          ? `Your estimated total: LKR ${total.toLocaleString("en-LK")}`
          : "Enter all four estimates to calculate a total. Use 0 where applicable."}
      </output>
      <p className="small muted">
        Formula: total tuition + (months × monthly costs) + other costs. Confirm
        fees and funding terms directly with the provider.
      </p>
    </section>
  );
}
