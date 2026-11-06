"""Import the supplied CINEC report, retaining reported facts and unknowns."""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STAGING = ROOT / 'data-staging/non-state/cinec'
STAGING.mkdir(parents=True, exist_ok=True)
SOURCE = STAGING / 'source-report.md'
if not SOURCE.exists():
    SOURCE.write_bytes((Path.home() / 'Downloads/CINEC Undergraduate and Diploma Programmes.md').read_bytes())
text = SOURCE.read_text(encoding='utf-8')
section = text.split('## **A.')[1].split('## **B.')[0]
rows = [re.split(r'(?<!\\)\|', line.strip())[1:-1] for line in section.splitlines() if line.startswith('| **')]
assert len(rows) == 34 and all(len(row) == 9 for row in rows)

def unescape(value):
    return re.sub(r'\\([^a-zA-Z0-9\s])', r'\1', value)

def clean(value, refs):
    value = unescape(value).strip()
    # Remove only a known row citation suffix, preserving meaningful digits
    # immediately before it (e.g. PTE 51 + citation 9, intake 2025 + 23).
    for ref in sorted(refs, key=len, reverse=True):
        pattern = re.escape(ref) + r'(?=\.?$)'
        if re.search(pattern, value):
            value = re.sub(pattern, '', value)
            break
    value = value.replace('**', '').replace('*', '').replace('\ufffd', '–')
    return re.sub(r'\s+', ' ', value).strip()

programmes = []
for number, row in enumerate(rows, 1):
    # Citation IDs are unambiguous after the title/awarding-body text or .html.
    refs = set()
    for cell in (row[0], row[2], row[7]):
        match = re.search(r'(\d+)\.?\s*$', cell)
        if match:
            refs.add(match[1])
    # Some cells cite the faculty while others cite a programme page.
    for cell in (row[3], row[5], row[6]):
        match = re.search(r'(?<=[A-Za-z)*=+])(\d+)\.?\s*$', unescape(cell))
        if match:
            refs.add(match[1])
    cells = [clean(cell, refs) for cell in row]
    title, _, award, fee, requirements, duration, campus, _, intake = cells
    url = re.search(r'https://www\.cinec\.edu/[^\s]+?\.html', unescape(row[7]))
    assert url, row[7]
    years = re.match(r'^(\d+) Years?\b', duration, re.I)
    if award.startswith('Same as teaching institution'):
        award = 'CINEC Campus'
    known = lambda value: None if value.lower().startswith('contact institution') else value
    summary_fee = None
    if known(fee):
        if number <= 3:
            summary_fee = 'LKR 1,200,000+ tuition + LKR 100,000+ registration + GBP 1,500 royalty (whole programme)'
        elif number == 4:
            summary_fee = 'LKR 400,000 tuition + LKR 100,000 registration + GBP 500 royalty (whole programme)'
        elif number == 6:
            summary_fee = 'LKR 2,200,000 total including registration (reported)'
        elif 21 <= number <= 24:
            summary_fee = 'LKR 2,250,000+ tuition + LKR 100,000+ registration; GBP 500 royalty per year'
        elif 25 <= number <= 27:
            summary_fee = 'LKR 700,000+ tuition + LKR 100,000+ registration + GBP 500 royalty'
        elif number == 28:
            summary_fee = 'LKR 480,000+ tuition + LKR 100,000 registration'
        else:
            raise AssertionError(f'Fee summary missing: {number}')
    programmes.append({
        'id': f'cinec-research-{number:02}', 'institution': 'CINEC Campus',
        'title': title, 'awarding_body': award, 'level': 'Foundation' if 'foundation' in title.lower() else 'Diploma' if re.search(r'diploma|\bhnd\b', title, re.I) else 'Degree',
        'subject_area': 'Computing' if number <= 9 else 'Business & logistics' if number <= 20 or number >= 31 else 'Engineering & technology' if number <= 29 else 'Computing',
        'duration_years': int(years[1]) if years else None,
        'duration_display': duration, 'campus_mode': known(campus), 'reported_intake': known(intake),
        'reported_fee': summary_fee, 'fee_notes': known(fee), 'requirements': known(requirements),
        'source_url': url[0], 'source_document': 'CINEC Undergraduate and Diploma Programmes.md',
        'source_row': number, 'report_date': '2026-11-05',
        'verification_status': 'reported_not_independently_verified',
    })
assert len({p['source_url'] for p in programmes}) == 34
(ROOT / 'src/data/nonState/cinec-basic.json').write_text(json.dumps(programmes, ensure_ascii=False, indent=2), encoding='utf-8')
with (STAGING / 'basic-programmes.csv').open('w', encoding='utf-8-sig', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=list(programmes[0])); writer.writeheader(); writer.writerows(programmes)
(STAGING / 'research-backlog.md').write_text('## Further research from supplied report\n\n' + text.split('## **C.')[1].split('## **D.')[0], encoding='utf-8')
(STAGING / 'basic-import-note.md').write_text('''# CINEC basic import

34 Section A listings imported from the supplied report dated 2026-11-05. This is collected research, not independent verification. Unknown fees, requirements and durations remain unknown. Three inaccessible management pages retain listings with missing details. Section C's 46 discovered names are preserved in research-backlog.md for later research.

Reported intake dates (including 2022 and 2025) are source information, not current availability. Fees retain currency, billing basis, registration and royalty components; no exchange rates or payment-plan totals are inferred. All reported payment options remain in fee notes. Monthly options may differ from stated whole-programme totals; confirm the chosen plan with CINEC. Citation suffixes and Markdown escapes are removed for display. Programme variants and awarding bodies remain distinct.

Run `python scripts/build-cinec-basic.py` to regenerate JSON and CSV from the staged original.
''', encoding='utf-8')
print(f'Imported {len(programmes)} CINEC listings; {sum(p["reported_fee"] is not None for p in programmes)} with reported fees. Preserved research backlog.')
