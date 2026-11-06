from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
scale={2:'2xs',4:'2xs',8:'xs',12:'sm',16:'md',24:'lg',32:'xl',48:'2xl',64:'3xl',96:'4xl'}
for name in ['app.css','portal.css']:
    path=root/'src/styles'/name
    text=path.read_text(encoding='utf-8')
    # 2px is a separate optical step rather than the shared 4px token.
    def spacing(m):
        value=re.sub(r'(?<![\w.])(4|8|12|16|24|32|48|64|96)px\b',lambda n:f'var(--space-{scale[int(n[1])]})',m[2])
        return m[1]+value+';'
    text=re.sub(r'((?<![-\w])(?:padding|margin|gap|row-gap|column-gap)(?:-(?:top|right|bottom|left|block|inline|block-start|block-end|inline-start|inline-end))?\s*:\s*)([^;{}]+);',spacing,text)
    text=text.replace('text-transform: uppercase','text-transform: none').replace('letter-spacing: 0.1em','letter-spacing: normal').replace('letter-spacing: 0.04em','letter-spacing: normal')
    if name=='app.css':
        text=text.replace('--retained-colour-2: #fff','--retained-colour-2: #fffffc').replace('--retained-colour-33: #000','--retained-colour-33: #172d27')
        text=re.sub(r'(\.dialog-heading\s*\{[^}]*?)position: sticky',r'\1position: relative',text)
        text=text.replace('button:disabled {','button:disabled {\n  background: var(--surface);\n  color: var(--muted);\n  cursor: not-allowed;')
    path.write_text(text,encoding='utf-8')
