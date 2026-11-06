"""Rebuild the new cutoff snapshot from the official PDF (requires pdfplumber).
Run with the bundled Python runtime. Keeps the 2024/2025 dataset unchanged.
"""
import hashlib
import json
import re
from pathlib import Path
import pdfplumber

ROOT = Path(__file__).resolve().parents[1]
STAGE = ROOT / 'data-staging/cutoffs-2025-2026'
PDF = STAGE / 'official-cutoffs.pdf'
OLD = json.loads((ROOT / 'src/data/ugc/historicalCutoffs.json').read_text(encoding='utf-8'))
URL = 'https://www.ugc.ac.lk/downloads/admissions/cutoff_2026/COP_2025_2026-ENGLISH_Final.pdf'
def norm(s): return re.sub(r'[^a-z0-9]', '', s.lower())
def chars_in(page, box):
    x0, y0, x1, y1 = box
    return ''.join(c['text'] for c in page.chars if x0 <= (c['x0']+c['x1'])/2 < x1 and y0 <= (c['top']+c['bottom'])/2 < y1).strip()
old_headers = {}
offerings = json.loads((ROOT / 'src/data/ugc/offerings.json').read_text(encoding='utf-8'))
# Explicit title + institution matches for the three headings absent from last year's table.
new_headers = {
    norm('Electronic and Intelligent Systems Engineering(University of Peradeniya)'): '143B',
    norm('GEOGRAPHICAL INFORMATION SYSTEMS(University of Ruhuna)'): '142F',
    norm('SPORTS SCIENCE #(University of Kelaniya)'): '141D',
}
for col in OLD['columns']:
    old_headers.setdefault(norm(col['raw_column_header']), []).append(col)
columns, unmatched, ignored = [], [], []
with pdfplumber.open(PDF) as pdf:
    for page_no, page in enumerate(pdf.pages, 1):
        table = page.find_tables()[0]
        rows = table.extract()
        district_rows = [(i, row) for i, row in enumerate(rows) if row[0] and norm(row[0]) in {norm(d['district_name']) for d in OLD['columns'][0]['district_cutoffs']}]
        assert len(district_rows) == 25, (page_no, len(district_rows))
        for ci in range(1, len(table.rows[0].cells)):
            header = chars_in(page, table.rows[0].cells[ci])
            values = [row[ci] for _, row in district_rows]
            if not header and not any(values):
                ignored.append({'page':page_no,'column':ci,'reason':'empty trailing table cell'})
                continue
            matches = old_headers.get(norm(header), [])
            mapped = matches[0] if len(matches) == 1 else None
            if norm(header) in new_headers:
                offering = next(o for o in offerings if o['uni_code'] == new_headers[norm(header)])
                mapped = {'uni_code_2025_2026':offering['uni_code'],'course_code_2025_2026':offering['course_code'],
                    'institution_id':offering['institution_id'],'institution_name_in_header':offering['institution_official_name'],
                    'course_title_in_header':offering['course_title_unicode_table'],'stream_or_category_qualifier':None}
            if not mapped or not mapped.get('uni_code_2025_2026'):
                unmatched.append({'page':page_no,'column':ci,'header':header,'old_matches':len(matches)})
            cells=[]
            for ri, row in district_rows:
                raw = (row[ci] or '').strip()
                independent = chars_in(page, table.rows[ri].cells[ci]).replace(' ', '')
                assert raw == independent, (page_no, ci, row[0], raw, independent)
                assert raw == 'NQC' or re.fullmatch(r'-?\d+\.\d{4}', raw), (page_no, ci, raw)
                district = next(d for d in OLD['columns'][0]['district_cutoffs'] if norm(d['district_name']) == norm(row[0]))
                cells.append({'district_id':district['district_id'],'district_name':district['district_name'],'z_score':None if raw=='NQC' else float(raw),'is_nqc':raw=='NQC','raw_value':raw})
            columns.append({
                'column_id':f'COP2025-2026-P{page_no:02}-C{ci:02}',
                'admission_year':'2025/2026','examination_year':'2025',
                'raw_column_header':header,
                'uni_code_2025_2026':mapped.get('uni_code_2025_2026') if mapped else None,
                'course_code_2025_2026':mapped.get('course_code_2025_2026') if mapped else None,
                'institution_id':mapped.get('institution_id') if mapped else None,
                'institution_name_in_header':mapped.get('institution_name_in_header','') if mapped else '',
                'course_title_in_header':mapped.get('course_title_in_header','') if mapped else '',
                'stream_or_category_qualifier':mapped.get('stream_or_category_qualifier') if mapped else None,
                'all_island_merit_marker':'*' in header,'practical_or_aptitude_marker':'#' in header,
                'mapping_status':('explicit_current_title_and_institution_match' if norm(header) in new_headers else 'exact_normalized_header_match') if mapped else 'requires_review',
                'mapping_note':None,'source_page':page_no,'district_cutoffs':cells,
            })
        print(f'Page {page_no}: checked {len(district_rows)} district rows', flush=True)
dataset={
    'dataset_title':'UGC minimum Z scores for selection, academic year 2025/2026',
    'admission_year':'2025/2026','examination_basis':'G.C.E. (Advanced Level) Examination 2025 (after re-scrutiny)',
    'handbook_edition':None,'source_url':URL,'publication_date':'2026-07-31',
    'source_sha256':hashlib.sha256(PDF.read_bytes()).hexdigest(),
    'source_file':'official-cutoffs.pdf','source_section':'Official 2025/2026 selection cutoffs','printed_page_range':'1–10',
    'legend':OLD['legend'],'columns':columns,
}
(STAGE/'extracted-cutoffs.json').write_text(json.dumps(dataset,ensure_ascii=False,indent=2),encoding='utf-8')
(STAGE/'mapping-review.json').write_text(json.dumps({'unmatched':unmatched,'ignored':ignored},ensure_ascii=False,indent=2),encoding='utf-8')
assert len(columns)==260 and not unmatched, 'Resolve all cutoff mappings before publishing'
cells=[d for c in columns for d in c['district_cutoffs']]
assert len(cells)==6500 and sum(d['is_nqc'] for d in cells)==1026
assert len({c['uni_code_2025_2026'] for c in columns})==255
dataset['summary_counts']={'columns':len(columns),'district_cells':len(cells),'numeric':sum(d['z_score'] is not None for d in cells),'nqc':sum(d['is_nqc'] for d in cells),'negative':sum(d['z_score'] is not None and d['z_score']<0 for d in cells),'selectable_offerings':len({c['uni_code_2025_2026'] for c in columns})}
assert dataset['summary_counts']=={'columns':260,'district_cells':6500,'numeric':5474,'nqc':1026,'negative':55,'selectable_offerings':255}
(STAGE/'extracted-cutoffs.json').write_text(json.dumps(dataset,ensure_ascii=False,indent=2),encoding='utf-8')
(ROOT/'src/data/ugc/cutoffs2025.json').write_text(json.dumps(dataset,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(json.dumps({'columns':len(columns),'unmatched':unmatched,'ignored':ignored},ensure_ascii=False,indent=2))
