"""Acquire and optimise the explicitly attributed Commons photograph."""
from pathlib import Path
from urllib.request import Request,urlopen
from io import BytesIO
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'.hallmark/python'))
from PIL import Image
import json
root=Path(__file__).resolve().parents[1]
url='https://upload.wikimedia.org/wikipedia/commons/8/80/University_Students_Studying_before_exams.jpg'
folder=root/'public/images'; folder.mkdir(exist_ok=True)
with urlopen(Request(url,headers={'User-Agent':'UniPedia educational directory asset preparation'}),timeout=40) as response:
    image=Image.open(BytesIO(response.read()))
image.thumbnail((1100,830))
image.convert('RGB').save(folder/'students-japura.webp','WEBP',quality=82)
(folder/'credits.json').write_text(json.dumps({'students-japura.webp':{'source':'https://commons.wikimedia.org/wiki/File:University_Students_Studying_before_exams.jpg','author':'Dinesh De Alwis','license':'CC BY-SA 3.0','license_url':'https://creativecommons.org/licenses/by-sa/3.0/','changes':'Resized, WebP conversion; displayed with CSS cropping','depicts':'Students studying before exams, Japura campus, Sri Lanka; 2013-11-26'}},indent=2),encoding='utf-8')
print('Saved', image.size, (folder/'students-japura.webp').stat().st_size,'bytes')
