"""Original temporary game score: no samples, downloads, or paid services.
Deterministic 16-second seamless harmonic loops; replace through audio/score.ts.
"""
from pathlib import Path
import math
import struct
import wave

OUT = Path(__file__).resolve().parent.parent / 'public' / 'audio' / 'score-v2'
OUT.mkdir(parents=True, exist_ok=True)
RATE = 22050
DURATION = 16
TAU = math.tau
# MIDI voicings, melody, instrument brightness, pulse intensity.
CUES = {
 'title': ([48,55,60,64], [72,76,79,83,79,76,74,72], .45, .05),
 'archive': ([45,52,57,60], [69,72,76,72,67,64,67,69], .15, .015),
 'descent': ([38,45,50,53], [62,65,69,65,62,60,57,60], .12, .15),
 'wonder': ([48,55,62,64], [76,79,86,83,79,76,74,79], .6, .03),
 'memory': ([53,60,64,69], [81,79,76,72,76,79,81,76], .7, .01),
 'exploration': ([48,55,57,64], [72,76,79,76,74,69,72,74], .4, .1),
 'celebration': ([48,55,60,67], [76,79,84,88,86,84,79,84], .8, .12),
}

def frequency(midi):
 return 440 * 2 ** ((midi - 69) / 12)

for name, (chord, melody, bright, pulse) in CUES.items():
 frames = bytearray()
 # Quantized oscillators complete an integer number of cycles per loop.
 roots = [round(frequency(note) * DURATION) / DURATION for note in chord]
 for i in range(RATE * DURATION):
  t = i / RATE
  pad = sum(math.sin(TAU*f*t + j*.4) * (.032 + .009*math.cos(TAU*t/DURATION+j)) for j,f in enumerate(roots))
  # Separate instrumentation and rhythm, not the same patch transposed seven ways.
  if name == 'archive':
   # Sparse low radio drone: no bell melody, no beat.
   local = t % 4
   ping = math.sin(TAU*frequency(69)*local)*math.exp(-local*8)*.035
   value = pad*.65 + ping
  elif name == 'descent':
   # Fast low tom pulse, octave bass and a tense sustained fifth.
   local = t % .5
   kick = math.sin(TAU*(65*local-30*local*local))*math.exp(-local*15)*.27
   drive = math.sin(TAU*roots[0]*2*t)*(.06+.035*math.sin(TAU*2*t))
   value = pad*.25 + kick + drive
  elif name == 'memory':
   # Slow high music-box bells with inharmonic upper partials, no bass pulse.
   local = t % 1
   f = frequency(melody[int(t)%8]+12)
   env = (1-math.exp(-local*130))*math.exp(-local*5)
   value = pad*.22 + (math.sin(TAU*f*local)+.28*math.sin(TAU*f*2.756*local))*env*.16
  elif name == 'exploration':
   # Dry marimba-like eighth notes and a small woody percussive backbeat.
   local = t % .25
   f = frequency(melody[int(t*4)%8]-12)
   pluck = (math.sin(TAU*f*local)+.3*math.sin(TAU*f*4*local))*math.exp(-local*24)*math.sin(min(1,local/.003)*math.pi/2)
   value = pad*.28 + pluck*.19
  elif name == 'celebration':
   # Brighter organ-like chord stabs and a quick rising upper melody.
   local = t % .5
   f = frequency(melody[int(t*2)%8])
   env = min(1,local/.015)*max(0,1-local/.38)
   value = pad*.8 + (math.sin(TAU*f*local)+.25*math.sin(TAU*f*3*local))*env*.15
  elif name == 'wonder':
   # Airy sustained chords and widely spaced, slowly blooming high notes.
   local = t % 4
   f = frequency(melody[int(t//2)%8])
   value = pad*1.1 + math.sin(TAU*f*local)*math.sin(math.pi*local/4)**2*.07
  else:
   # Title: gentle plucked arpeggio, medium tempo, recognizable repeating motif.
   local = t % .5
   f = frequency(melody[int(t*2)%8])
   env = (1-math.exp(-local*70))*math.exp(-local*8)
   value = pad*.5 + (math.sin(TAU*f*local)+.18*math.sin(TAU*f*2*local))*env*.17
  value = max(-.9, min(.9, value))
  frames.extend(struct.pack('<h', int(value * 24000)))
 with wave.open(str(OUT / (name + '.wav')), 'wb') as out:
  out.setparams((1,2,RATE,0,'NONE','not compressed'))
  out.writeframes(frames)
 print(name)
