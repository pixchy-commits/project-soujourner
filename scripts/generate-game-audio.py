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
write("pathfinder-blip", .075, lambda t,p: (math.sin(2*math.pi*(330*t+280*t*t))*.27+math.sin(2*math.pi*660*t)*.04)*math.sin(math.pi*p)**2)
# Filter-like airy sweep and a falling tape/CRT rewind.
write("scene-sweep", .65, lambda t,p: (math.sin(2*math.pi*(140*t+140*t*t))*.14+rng.uniform(-1,1)*.08)*math.sin(math.pi*p)**2)
write("time-rewind", 1.1, lambda t,p: (math.sin(2*math.pi*(540*t-210*t*t))*.18+math.sin(2*math.pi*83*t)*.08+rng.uniform(-1,1)*.04)*math.sin(math.pi*p)**2)

# Short punctuation cues: reserved for meaningful moments, not every next click.
def chime(t, notes):
    value = 0
    for start, hz in notes:
        age = t - start
        if age >= 0:
            value += math.sin(2*math.pi*hz*age) * (1-math.exp(-age*100)) * math.exp(-age*6) * .22
    return value
write("chapter-chime", 1.5, lambda t,p: chime(t, [(0,523.25),(.18,659.25),(.38,783.99)]) * min(1,(1-p)*12))
write("memory-chime", 1.2, lambda t,p: chime(t, [(0,1046.5),(.12,783.99),(.27,659.25)]) * min(1,(1-p)*12))
write("mission-success", 1.5, lambda t,p: chime(t, [(0,523.25),(.14,659.25),(.28,783.99),(.5,1046.5)]) * min(1,(1-p)*12))
write("radio-connect", .3, lambda t,p: math.sin(2*math.pi*(440 if t < .12 else 660)*t)*.16*math.sin(math.pi*p)**2)

# Periodic layered oscillators produce unobtrusive, seamless ambience beds.
def whoosh(t, p):
    # Broadband airy attack with a falling resonant body; no musical blip.
    envelope = math.sin(math.pi*p)**1.5
    return (rng.uniform(-1,1)*.48 + math.sin(2*math.pi*(1100*t-700*t*t))*.14)*envelope
write("montage-in-v2", .52, whoosh)
def shuffle(t,p):
    value = 0
    for start in [0,.085,.17,.255]:
        age = t-start
        if 0 <= age < .36:
            value += (rng.uniform(-1,1)*.2+math.sin(2*math.pi*(450*age-350*age*age))*.1)*math.sin(math.pi*age/.36)**2
    if .63 <= t < .76:
        value += (math.sin(2*math.pi*150*t)*.35+rng.uniform(-1,1)*.12)*math.exp(-(t-.63)*42)
    return value
write("montage-shuffle-v2", .9, shuffle)

for name, base in [("archive-room", 48), ("mars-wind", 31), ("entry-rumble", 26), ("earth-lab", 60)]:
    write(name, 8, lambda t,p,b=base: sum(math.sin(2*math.pi*(b+j*.125)*t+j*.7)*(.035/(j+1))*(.7+.3*math.cos(2*math.pi*p*(j%3+1))) for j in range(12)))
