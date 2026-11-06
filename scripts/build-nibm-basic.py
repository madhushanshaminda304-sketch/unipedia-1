"""Build basic NIBM listings from the user's report, preserving staged fees."""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STAGING = ROOT / 'data-staging/non-state/nibm'
STAGING.mkdir(parents=True, exist_ok=True)
SOURCE = STAGING / 'source-report.md'
if not SOURCE.exists():
    SOURCE.write_bytes((Path.home() / 'Downloads/NIBM Sri Lanka Programme Research.md').read_bytes())
text = SOURCE.read_text(encoding='utf-8')
bibliography = dict(re.findall(r'(?m)^> (\d+)\..*?\]\((https://[^)]+)\)', text))
table = text.split('## **A.')[1].split('## **B.')[0]
rows = [re.split(r'(?<!\\)\|', line.strip())[1:-1] for line in table.splitlines() if re.match(r'^\| \d+ \|', line)]
assert len(rows) == 32 and all(len(row) == 10 for row in rows)

def unescape(value):
    return re.sub(r'\\([^a-zA-Z0-9\s])', r'\1', value)

def clean(value, refs):
    value = unescape(value).strip()
    choices = '|'.join(re.escape(ref) for ref in sorted(refs, key=len, reverse=True))
    value = re.sub(r'(?<=[A-Za-z)*])(?:' + choices + r')(?=[.,;\s]|$)', '', value)
    # Citations attached directly to dates (e.g. 2026 + 16).
    value = re.sub(r'(20\d{2})(?:' + choices + r')(?=[.,;\s]|$)', r'\1', value)
    value = re.sub(r'\s*\(see Note B\d\)', '', value)
    value = value.replace('**', '').replace('*', '').replace('•', ';')
    value = re.sub(r'([:.])\s*;\s*', r'\1 ', value)
    return re.sub(r'\s+', ' ', value).strip(' ;')

fees = {}
for number in (1, 2, 3, 5, 6):
    fees[number] = 'Local tuition by year: LKR 350,000 / 350,000 / 850,000 / 800,000; registration fees extra (see details)'
fees.update({
    4: 'Local tuition by year: LKR 350,000 / 450,000 / 1,000,000; registration fees extra (see details)',
    7: 'Local tuition by year: LKR 350,000 / 850,000 / 800,000; registration fees extra (see details)',
    11: 'LKR 300,000 course fee + LKR 5,000 registration (whole programme)',
    13: 'Conflicting options: LKR 850,000 standalone HND or LKR 450,000 BSc Year 2 stage; each lists LKR 5,000 registration. Confirm with NIBM.',
    20: 'LKR 250,000 course fee + LKR 5,000 registration (whole programme)',
    22: 'LKR 225,000 course fee + LKR 5,000 registration (whole programme, 1.5 years)',
    27: 'Local tuition by year: LKR 300,000 / 400,000 / 1,000,000; registration fees extra (see details)',
    31: 'LKR 400,000 course fee + LKR 8,000 registration (whole programme)',
    32: 'Local tuition by year: LKR 200,000 / 900,000 / 900,000; registration fees extra (see details)',
})
for number in (8, 9, 10, 12, 14, 15, 16, 17, 18, 19, 21, 23):
    fees[number] = 'LKR 350,000 course fee + LKR 5,000 registration (whole programme)'
for number in (24, 25, 26):
    fees[number] = 'LKR 150,000 course fee + LKR 5,000 registration (whole programme, 6 months)'
for number in (28, 29, 30):
    fees[number] = 'LKR 400,000 course fee + LKR 5,000 registration (whole programme)'

programmes = []
for row in rows:
    number = int(row[0].strip())
    refs = set()
    for cell in row[1:]:
        refs.update(re.findall(r'(?<=[A-Za-z)*])(\d+)(?=[.,;\s]|$)', unescape(cell)))
    refs &= bibliography.keys()
    raw_urls = unescape(row[8])
    urls = [url for url in bibliography.values() if re.search(re.escape(url) + r'\d+(?=\s|$)', raw_urls)]
    primary = [url for url in urls if url.startswith('https://nibm.ac.lk/course/')]
    assert len(primary) == 1, (number, primary)
    cells = [clean(cell, refs) for cell in row]
    title = clean(re.match(r'\s*\*\*(.+?)\*\*', row[1])[1], refs)
    duration = cells[6]
    years = re.fullmatch(r'(\d+(?:\.\d+)?) Years?', duration, re.I)
    degree = number <= 7 or number in (27, 32)
    notes = []
    if degree:
        notes.append('This is a staged degree pathway: intermediate qualifications are awarded by NIBM and the final degree by the reported partner university. Annual fees apply to the stated stage; overseas-transfer fees are not supplied.')
    if number in (1, 2):
        notes.append('The report could not capture the complete A/L entry option. Confirm that route with NIBM; the listed O/L and certificate options should not be treated as the only routes. Year 3 intake dates differ between cited NIBM pages (13 versus 14 October 2026).')
    if number == 1:
        notes.append('The report infers Coventry University from related programmes; the primary course page does not name the UK partner. Confirm the awarding university with NIBM.')
    if number in (3, 6, 7):
        notes.append('The report notes a revised curriculum from intake 27.1; confirm the curriculum applicable to your intake.')
    if number in (15, 17, 20):
        notes.append('The report states that part of the A/L stream criteria was truncated. Confirm complete A/L eligibility with NIBM.')
    if number == 18:
        notes.append('Work-experience conflict: the reported O/L route states both a minimum of 6 months and an overarching 1 year. Confirm the applicable requirement with NIBM.')
    if number == 13:
        notes.append('The standalone page reports 2 years, full time, LKR 850,000 tuition; the BSc Year 2 stage reports 1 year, part time, LKR 450,000 tuition. Both list LKR 5,000 registration. These are unresolved differences; confirm the route, duration and fee with NIBM.')
    if number == 31:
        notes.append('The baseline O/L credit requirement was not captured in the report. The English requirement alone is not a complete entry rule; confirm general eligibility with NIBM.')
    programmes.append({
        'id': f'nibm-research-{number:02}', 'institution': 'NIBM', 'title': title,
        'awarding_body': 'UK partner university; Coventry attribution needs confirmation' if number == 1 else cells[3],
        'level': 'Foundation' if number in (24, 25, 26, 31) else 'Degree' if degree else 'Diploma',
        'subject_area': 'Computing & multimedia' if number <= 26 else 'Data science' if number == 27 else 'Business & human resources' if number <= 31 else 'English & teaching',
        'duration_years': float(years[1]) if years else None, 'duration_display': duration,
        'campus_mode': cells[7], 'reported_intake': cells[9] if not cells[9].lower().startswith('contact institution') else None,
        'reported_fee': fees[number], 'fee_notes': cells[4], 'requirements': cells[5],
        'programme_notes': ' '.join(notes) or None,
        'source_url': primary[0], 'supporting_urls': list(dict.fromkeys(urls)),
        'source_document': 'NIBM Sri Lanka Programme Research.md', 'source_row': number,
        'report_date': '2026-11-05', 'verification_status': 'reported_not_independently_verified',
    })
assert len({p['source_url'] for p in programmes}) == 32
(ROOT / 'src/data/nonState/nibm-basic.json').write_text(json.dumps(programmes, ensure_ascii=False, indent=2), encoding='utf-8')
with (STAGING / 'basic-programmes.csv').open('w', encoding='utf-8-sig', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=list(programmes[0])); writer.writeheader(); writer.writerows(programmes)
(STAGING / 'research-backlog.md').write_text('## Further research from supplied report\n\n' + text.split('## **C.')[1].split('## **D.')[0], encoding='utf-8')
(STAGING / 'entry-route-references.md').write_text('# Supplementary entry routes from supplied report\n\n' + text.split('### **B2.')[1].split('### **B3.')[0], encoding='utf-8')
(STAGING / 'basic-import-note.md').write_text('''# NIBM basic import

32 Section A listings imported from the supplied report dated 2026-11-05, keeping full-time and part-time qualifications distinct. The 20 discovered programme names and remaining faculties are preserved in research-backlog.md. Four certificate/transfer entry references are retained in entry-route-references.md, separately from the 32 core listings.

This is attributed research, not independent verification or complete NIBM coverage. Annual degree-stage fees are not extrapolated into whole-degree totals. Registration fees, incomplete entry criteria, work-experience conflicts and the AI HND fee/duration/mode differences remain visible. The inferred Coventry attribution for the first degree is explicitly marked for confirmation. Intake dates are source information, not live availability. The primary public course URL is used, not the development domain. Supporting URLs and original Markdown are retained.

Run `python scripts/build-nibm-basic.py` to regenerate JSON and CSV.
''', encoding='utf-8')
print(f'Imported {len(programmes)} NIBM listings with reported fees; preserved staged costs, conflicts and source references.')
