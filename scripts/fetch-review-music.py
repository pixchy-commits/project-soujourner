"""Download the approved listening shortlist from the composer's own MP3 links.
No API key, paid service, or audio generation. Existing files are kept.
"""
from pathlib import Path
import subprocess
import json

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public/audio/scott-buckley'
OUT.mkdir(parents=True, exist_ok=True)
TRACKS = [
 ('signal-to-noise-no-melody', 'Signal to Noise', 'https://www.scottbuckley.com.au/library/wp-content/uploads/2020/04/sb_signaltonoise_nomelody.mp3', 'signal-to-noise', 'No Piano Melody alternate mix'),
 ('discovery', 'Discovery', 'https://www.scottbuckley.com.au/library/wp-content/uploads/2020/01/sb_discovery.mp3', 'discovery', 'Full mix'),
 ('adrift-among-infinite-stars', 'Adrift Among Infinite Stars', 'https://www.scottbuckley.com.au/library/wp-content/uploads/2022/02/AdriftAmongInfiniteStars.mp3', 'adrift-among-infinite-stars', 'Full mix'),
 ('first-snow', 'First Snow', 'https://www.scottbuckley.com.au/library/wp-content/uploads/2022/12/FirstSnow.mp3', 'first-snow', 'Full mix'),
 ('childhood', 'Childhood', 'https://www.scottbuckley.com.au/library/wp-content/uploads/2019/01/sb_childhood.mp3', 'childhood', 'Full mix'),
 ('tomorrow', 'Tomorrow', 'https://www.scottbuckley.com.au/wp-content/audio/sb_tomorrow.mp3', 'tomorrow', 'Full mix'),
]
credits = []
for slug, title, url, page, variant in TRACKS:
 target = OUT / (slug + '.mp3')
 if not target.exists():
  temporary = target.with_suffix('.download')
  subprocess.run(['curl.exe', '-L', '--fail', '--silent', '--show-error', '--max-time', '90', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '-e', 'https://www.scottbuckley.com.au/library/'+page+'/', '-o', str(temporary), url], check=True)
  data = temporary.read_bytes()
  if len(data) < 10000 or data.lstrip().startswith((b'<!DOCTYPE', b'<html')):
   raise RuntimeError('Expected MP3, received an invalid download: ' + title)
  # MP3 starts with ID3 metadata or MPEG frame sync; never install an HTML response.
  if not (data.startswith(b'ID3') or (data[0] == 255 and data[1] & 224 == 224)):
   raise RuntimeError('Unrecognized MP3 header: ' + title)
  target.write_bytes(data)
  temporary.unlink()
 print(title + ': ' + str(target.stat().st_size) + ' bytes', flush=True)
 credits.append({'title':title,'composer':'Scott Buckley','source':'https://www.scottbuckley.com.au/library/'+page+'/', 'license':'CC BY 4.0','licenseUrl':'https://creativecommons.org/licenses/by/4.0/','variant':variant,'src':'/audio/scott-buckley/'+slug+'.mp3','changes':'Original MP3; runtime volume and fades only; no file edits.'})
(OUT / 'credits.json').write_text(json.dumps(credits, indent=2)+'\n', encoding='utf8')
