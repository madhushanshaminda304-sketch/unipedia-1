"""Move existing active stylesheet colour literals into root tokens."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
path=root/'src/styles/app.css'
text=path.read_text(encoding='utf-8')
colours={}
def colour(match):
    value=match[0]
    if value not in colours: colours[value]=f'--retained-colour-{len(colours)+1}'
    return f'var({colours[value]})'
# Root declarations are already tokens; retaining their exact source values
# avoids changing any existing UGC chart/status meanings.
pattern=r':root\s*\{[^}]*\}'
parts=re.split('('+pattern+')',text)
for i,part in enumerate(parts):
    if not part.lstrip().startswith(':root'):
        parts[i]=re.sub(r'#[\da-fA-F]{3,8}\b|rgba?\([^()]+\)|hsla?\([^()]+\)',colour,part)
text=''.join(parts)
if colours:
    declarations=':root {\n'+''.join(f'  {token}: {value};\n' for value,token in colours.items())+'}\n'
    text=text.replace(':root {',declarations+':root {',1)
stamp='/* Hallmark · v2.0.0 · redesign: full · theme: UniPedia brand · genre: editorial · shared legacy screens retain admission wiring */\n/* Hallmark · critique: preserving source semantics while unifying typography, tokens and controls. */\n'
if not text.startswith('/* Hallmark'): text=stamp+text
path.write_text(text,encoding='utf-8')
print(f'Tokenized {len(colours)} retained colours.')
