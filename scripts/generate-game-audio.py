"""Generate small original game SFX. Run with Python's standard library only."""
from pathlib import Path
import math
import random
import struct
import wave

OUT = Path(__file__).resolve().parent.parent / "public" / "audio"
OUT.mkdir(parents=True, exist_ok=True)
RATE = 22050
rng = random.Random(1997)

def write(name, duration, sample):
    frames = bytearray()
    for i in range(int(RATE * duration)):
        t = i / RATE
        value = max(-1, min(1, sample(t, t / duration)))
        frames.extend(struct.pack("<h", int(value * 25000)))
    with wave.open(str(OUT / (name + ".wav")), "wb") as out:
        out.setparams((1, 2, RATE, 0, "NONE", "not compressed"))
        out.writeframes(frames)

# A tactile, warm switch rather than a harsh browser/UI blip.
write("menu-click", .085, lambda t, p: (math.sin(2*math.pi*(720*t-1800*t*t))*.5 + rng.uniform(-1,1)*.2)*math.exp(-t*65)*min(1,t/.002))
# Short soft mechanical tick for the archive narrator.
write("type-tick", .035, lambda t,p: (rng.uniform(-1,1)*.32 + math.sin(2*math.pi*920*t)*.17)*math.exp(-t*130)*min(1,t/.002))
# A gentle voiced chirp for the rover characters.
write("rover-blip", .055, lambda t,p: (math.sin(2*math.pi*(590*t+1000*t*t))*.3+math.sin(2*math.pi*1180*t)*.06)*math.sin(math.pi*p)**2)
# Filter-like airy sweep and a falling tape/CRT rewind.
write("scene-sweep", .65, lambda t,p: (math.sin(2*math.pi*(140*t+140*t*t))*.14+rng.uniform(-1,1)*.08)*math.sin(math.pi*p)**2)
write("time-rewind", 1.1, lambda t,p: (math.sin(2*math.pi*(540*t-210*t*t))*.18+math.sin(2*math.pi*83*t)*.08+rng.uniform(-1,1)*.04)*math.sin(math.pi*p)**2)
