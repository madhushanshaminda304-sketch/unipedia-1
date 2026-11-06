"""Extract the 24 supplied SLIIT fact sheets into simple, attributed listings."""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'data-staging/non-state/sliit/source-report.md'
text = SOURCE.read_text(encoding='utf-8')
bibliography = dict(re.findall(r'(?m)^> (\d+)\..*?\]\((https://[^)]+)\)', text))

def clean(value):
    value = re.sub(r'\\([\\`*_{}\[\]()#+.!:|&-])', r'\1', value)
    value = re.sub(r'https?://[^\s)]+', '', value)
    value = re.sub(r'\([\s,]*\)\d*', '', value)
    value = value.replace('**', '').replace('*', '')
    value = re.sub(r'\(\s*\)', '', value)
    value = re.sub(r'(?<=[.)])\d+(?=\s|$)', '', value)
    return re.sub(r'\s+', ' ', value).strip(' .|')

# Amounts retain the report's semester/year basis; no full-course totals are inferred.
fees = {
 1:'LKR 325,000 per semester',2:'LKR 375,000–385,000 per semester',3:'LKR 375,000–385,000 per semester',
 4:'LKR 375,000 per semester',5:'LKR 375,000–385,000 per semester',6:'LKR 375,000–385,000 per semester',
 7:'LKR 375,000–385,000 per semester',9:'LKR 375,000–385,000 per semester',
 11:'LKR 980,000 for Year 1; later AUD fees apply',14:'LKR 460,000 per semester',15:'LKR 460,000 per semester',
 16:'LKR 460,000 per semester',18:'LKR 610,000 per semester at SLIIT; overseas fees additional',
 19:'LKR 340,000 per semester',20:'LKR 340,000 per semester',23:'LKR 100,000 per semester',24:'LKR 100,000 per semester',
}
programmes=[]
for block in re.split(r'(?m)^#### \*\*Fact Sheet ',text)[1:]:
    heading=block.splitlines()[0]
    match=re.match(r'\\#(\d+): (.*?)\*\*$',heading)
    assert match, heading
    number=int(match[1]);title=clean(match[2]).replace(' (and IT Bridging Programme)','')
    fields={}
    for line in block.splitlines()[1:]:
        match=re.match(r'^\| \*\*(.*?)\*\* \| (.*) \|$',line)
        if match: fields[match[1]]=match[2]
    raw_url=re.sub(r'\\([.:_])',r'\1',fields['Programme Detail URL'])
    candidates=[u for u in bibliography.values() if u.startswith('https://www.sliit.lk/study/find-a-program/') and u in raw_url]
    assert candidates, raw_url
    url=max(candidates,key=len)
    assert url.startswith('https://www.sliit.lk/study/find-a-program/'),url
    duration_raw=fields.get('Duration, Campus, Mode & Medium','')
    duration=re.search(r'\*\*Duration:\*\*\s*(\d+)\s*Years?',duration_raw,re.I)
    award=fields.get('Teaching & Awarding Body','')
    awarding=next((name for name in ['University of Queensland','Liverpool John Moores University','Deakin University'] if name.lower() in award.lower()),'SLIIT' if 'SLIIT' in award else None)
    fee_text=fields.get('Published Fees & Payment Basis','')
    fee_notes=clean(re.split(r'\*\*Supporting Excerpts?:',fee_text)[0])
    programmes.append({
      'id':f'sliit-research-{number:02}', 'institution':'SLIIT', 'title':title,
      'awarding_body':awarding,'level':'Foundation' if number==1 else 'Degree',
      'subject_area':'Foundation' if number==1 else 'Computing' if number<=13 else 'Engineering & built environment' if number<=19 else 'Business' if number<=22 else 'Education',
      'duration_years':int(duration[1]) if duration else None,
      'reported_fee':fees.get(number), 'fee_notes':fee_notes,
      'requirements':clean(fields.get('Entry Requirements & Alternative Routes','')) or None,
      'source_url':url,'source_document':'SLIIT Undergraduate Programme Research.md',
      'source_fact_sheet':number,'report_date':'2026-11-05','verification_status':'reported_not_independently_verified',
    })
assert len(programmes)==24 and len({p['source_url'] for p in programmes})==24
out=ROOT/'src/data/nonState';out.mkdir(parents=True,exist_ok=True)
(out/'sliit-basic.json').write_text(json.dumps(programmes,ensure_ascii=False,indent=2),encoding='utf-8')
with (SOURCE.parent/'basic-programmes.csv').open('w',encoding='utf-8-sig',newline='') as f:
    writer=csv.DictWriter(f,fieldnames=list(programmes[0]));writer.writeheader();writer.writerows(programmes)
print(f'Extracted {len(programmes)} basic programme records; unknown fees/durations remain empty. Exported CSV.')
