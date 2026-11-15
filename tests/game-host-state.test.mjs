import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

for (const game of ["landing", "wheel-test"]) {
  test(`${game}: only trusted host messages control pause, controls and sound`, () => {
    const source = readFileSync(new URL(`../public/games/${game}.html`, import.meta.url), "utf8").replaceAll("\r\n", "\n");
    const handler = source.match(/window\.addEventListener\('message', event => \{\n  if \(event\.origin !== window\.location\.origin[\s\S]*?\n\}\);/)[0];
    let receive;
    const parent = {};
    const context = {
      window: { location: { origin: "https://sojo.example" }, parent, addEventListener: (_, fn) => { receive = fn; } },
      document: { body: { inert: false, dataset: {} } },
      SND: { windGain: { gain: { value: 1 } } },
      hostPaused: false,
      hostSoundVolume: 1,
    };
    runInNewContext(handler, context);
    const data = { type: "sojo-host-state", paused: true, embedded: true, soundVolume: 0 };
    receive({ origin: "https://untrusted.example", source: parent, data });
    receive({ origin: context.window.location.origin, source: {}, data });
    expect(context.hostPaused).toBe(false);
    expect(context.hostSoundVolume).toBe(1);
    const send = data => receive({ origin: context.window.location.origin, source: parent, data });
    send(data);
    expect(context.document.body.inert).toBe(true);
    expect(context.document.body.dataset.hosted).toBe("true");
    expect(context.hostSoundVolume).toBe(0);
    send({ ...data, paused: false, soundVolume: 0.35 });
    expect(context.document.body.inert).toBe(false);
    expect(context.hostSoundVolume).toBe(0.35);
    send({ ...data, soundVolume: 5 });
    expect(context.hostSoundVolume).toBe(1);
    send({ ...data, soundVolume: NaN });
    expect(context.hostSoundVolume).toBe(1);
  });
}
