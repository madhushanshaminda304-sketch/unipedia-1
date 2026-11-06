import fs from "node:fs";
import ts from "typescript";
const root = new URL("../", import.meta.url);
const snapshot = ts.transpileModule(
  fs.readFileSync(new URL("src/data/sriLankaUgcSnapshot.ts", root), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.ES2022 } },
).outputText;
const { PRIVATE_AND_ALTERNATIVE_PROGRAMS: previous } = await import(
  `data:text/javascript;base64,${Buffer.from(snapshot).toString("base64")}`
);
const imported = ["sliit", "cinec", "nsbm", "nibm"].flatMap((name) =>
  JSON.parse(
    fs.readFileSync(
      new URL(`src/data/nonState/${name}-basic.json`, root),
      "utf8",
    ),
  ),
);
const earlier = previous.filter(
  (p) =>
    !/sliit|cinec|nsbm|nibm|sri lanka institute of information technology|national institute of business management/i.test(
      `${p.institute_code} ${p.institute_name}`,
    ),
);
const slug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const read = (name) =>
  JSON.parse(
    fs.readFileSync(new URL(`src/data/ugc/${name}.json`, root), "utf8"),
  );
const paths = [
  "/",
  "/courses",
  "/interests",
  "/dates",
  "/pathways",
  "/about",
  "/privacy",
  "/terms",
  "/tools",
  "/tools/budget",
  "/contact",
  "/sitemap",
  "/institutions?route=catalogue",
  "/explore",
  "/institutions",
  "/guides",
  ...[
    "understanding-z-scores",
    "degree-or-hnd",
    "foundation-routes",
    "planning-study-costs",
  ].map((s) => `/guides/${s}`),
  ...[...imported, ...earlier].map((p) => `/programmes/${p.id}`),
  ...new Set(
    [
      ...imported.map((p) => p.institution),
      ...earlier.map((p) => p.institute_name),
    ].map((name) => `/institutions/${slug(name)}`),
  ),
  ...read("institutions")
    .filter((i) => i.ugc_admission_participating)
    .map((i) => `/universities/${i.institution_id}`),
  ...read("offerings")
    .filter((o) => o.is_selectable_unicode_offering)
    .map((o) => `/courses/${o.uni_code}`),
];
const uniquePaths = [...new Set(paths)];
const xmlEscape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
fs.writeFileSync(
  new URL("public/sitemap.xml", root),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniquePaths.map((p) => `  <url><loc>${xmlEscape(`https://unipedia.lk${p}`)}</loc></url>`).join("\n")}\n</urlset>\n`,
);
console.log(`Generated ${uniquePaths.length} public sitemap routes.`);
