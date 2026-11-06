"""Import the supplied NSBM research without resolving reported conflicts by guesswork."""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STAGING = ROOT / 'data-staging/non-state/nsbm'
STAGING.mkdir(parents=True, exist_ok=True)
SOURCE = STAGING / 'source-report.md'
if not SOURCE.exists():
    SOURCE.write_bytes((Path.home() / 'Downloads/NSBM Undergraduate Programme Research.md').read_bytes())
text = SOURCE.read_text(encoding='utf-8')
table = text.split('## **A.')[1].split('## **B.')[0]
rows = [re.split(r'(?<!\\)\|', line.strip())[1:-1] for line in table.splitlines() if line.startswith('| **')]
assert len(rows) == 28 and all(len(row) == 9 for row in rows)

def unescape(value):
    return re.sub(r'\\([^a-zA-Z0-9\s])', r'\1', value)

def clean(value, refs):
    value = unescape(value).strip()
    # Known source citations follow words/Markdown, rather than standalone
    # numbers. Remove them throughout cells, preserving grades, years and fees.
    choices = '|'.join(re.escape(ref) for ref in sorted(refs, key=len, reverse=True))
    value = re.sub(r'(?<=[A-Za-z)*])(?:' + choices + r')(?=[.,;\s]|$)', '', value)
    value = value.replace('**', '').replace('*', '').replace('\ufffd', '–')
    return re.sub(r'\s+', ' ', value).strip()

fees = {
    1: 'LKR 800,000 for the whole foundation programme',
    6: 'LKR 400,000 per semester',
    14: 'Conflicting local fee figures: LKR 2,300,000 published total; annual and instalment figures differ. Confirm with NSBM; overseas fees unknown.',
    15: 'LKR 400,000 per semester',
    21: 'LKR 1,200,000 Year 1; LKR 700,000 each for Years 2 and 3; registration LKR 10,000 and library LKR 5,000 listed separately. Flexible-fee notice also reported; confirm with NSBM.',
    22: 'Conflicting fees: LKR 800,000 per year and LKR 450,000 per semester reported. Confirm with NSBM.',
}
for number in (2, 3, 4, 5, 16, 17):
    fees[number] = 'Conflicting fees: LKR 2,800,000 whole programme and LKR 400,000 per semester reported. Confirm with NSBM.'
for number in range(7, 12):
    fees[number] = 'LKR 2,600,000 whole programme; registration LKR 10,000 and library LKR 5,000 listed separately'

programmes = []
for number, row in enumerate(rows, 1):
    raw_url = unescape(row[7]).strip()
    match = re.fullmatch(r'(https://www\.nsbm\.ac\.lk/course/[^/\s]+/)(\d+)', raw_url)
    assert match, raw_url
    refs = {match[2]}
    for cell in row[1:3]:
        citation = re.search(r'(\d+)\s*$', cell)
        if citation:
            refs.add(citation[1])
    cells = [clean(cell, refs) for cell in row]
    title = clean(re.match(r'\s*\*\*(.+?)\*\*', row[0])[1], refs)
    duration = cells[5]
    # A single number is safe only for an unqualified fixed duration.
    years = re.fullmatch(r'(\d+) Years?', duration, re.I)
    if number == 12:
        duration = 'Conflicting durations: 3 or 4 years reported; confirm with NSBM'
    fee = fees.get(number)
    if not cells[3].lower().startswith('contact institution'):
        assert fee is not None, f'Fee summary missing for {number}'
    programmes.append({
        'id': f'nsbm-research-{number:02}', 'institution': 'NSBM Green University',
        'title': title, 'awarding_body': cells[2], 'level': 'Foundation' if number == 1 else 'Degree',
        'subject_area': 'Foundation: Business, Computing, Science, Engineering, Design' if number == 1 else 'Computing' if number <= 14 else 'Business' if number <= 21 else 'Engineering & design' if number <= 27 else 'Science & psychology',
        'duration_years': int(years[1]) if years else None, 'duration_display': duration,
        'duration_notes': cells[5] if number == 12 else None,
        'campus_mode': cells[6], 'reported_intake': None,
        'reported_fee': fee, 'fee_notes': cells[3], 'requirements': cells[4],
        'source_url': match[1], 'source_document': 'NSBM Undergraduate Programme Research.md',
        'source_row': number, 'report_date': '2026-11-05',
        'verification_status': 'reported_not_independently_verified',
    })
assert len({p['source_url'] for p in programmes}) == 28
(ROOT / 'src/data/nonState/nsbm-basic.json').write_text(json.dumps(programmes, ensure_ascii=False, indent=2), encoding='utf-8')
with (STAGING / 'basic-programmes.csv').open('w', encoding='utf-8-sig', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=list(programmes[0])); writer.writeheader(); writer.writerows(programmes)
(STAGING / 'research-backlog.md').write_text('## Further research from supplied report\n\n' + text.split('## **C.')[1].split('## **D.')[0], encoding='utf-8')
(STAGING / 'basic-import-note.md').write_text('''# NSBM basic import

28 Section A listings imported from the supplied report dated 2026-11-05: one foundation listing covering five streams, 13 computing degrees and 14 other degrees. The 37 names in Section C are preserved separately in research-backlog.md. This is attributed research, not independent website verification or a claim of complete NSBM coverage.

Fee and duration conflicts remain visible. Semester fees are never multiplied into estimated totals. Separate registration/library fees remain itemized in fee notes. Victoria University local fees are not presented as Melbourne transfer fees. Unknown intake dates and fees stay unknown. Requirements retain alternative routes, bridging, subject/English conditions, tests and top-up experience requirements. Variable durations and internships remain text rather than a misleading single numeric duration. Original Markdown is preserved; display text removes citation numbers and formatting.

Run `python scripts/build-nsbm-basic.py` to regenerate JSON and CSV.
''', encoding='utf-8')
print(f'Imported {len(programmes)} NSBM listings; {sum(p["reported_fee"] is not None for p in programmes)} with reported fee figures. Preserved backlog.')
