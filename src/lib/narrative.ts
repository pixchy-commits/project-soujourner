import { setup } from "xstate";

export const narrativeMachine = setup({
  types: { events: {} as { type: "START" | "NEXT" | "BACK" | "HOME" } },
}).createMachine({
  id: "sojourner",
  initial: "menu",
  on: { HOME: ".menu" },
  states: {
    menu: { on: { START: "signal" } },
    signal: { on: { NEXT: "arrival", BACK: "menu" } },
    arrival: { on: { NEXT: "firstSteps", BACK: "signal" } },
    firstSteps: { on: { NEXT: "entry", BACK: "arrival" } },
    entry: { on: { NEXT: "window", BACK: "firstSteps" } },
    window: { on: { NEXT: "wonder", BACK: "entry" } },
    wonder: { on: { NEXT: "landing", BACK: "window" } },
    landing: { on: { NEXT: "complete", BACK: "wonder" } },
    complete: { on: { START: "signal", BACK: "wonder" } },
  },
});

export const chapters = [
  {
    state: "signal", label: "INCOMING TRANSMISSION", date: "MARS · THE PRESENT DAY",
    title: "The ones we left behind.", speaker: "MISSION ARCHIVE",
    text: "Across the rusty plains of Mars rest silent machines built by human hands. They have no way to come home, and some of their radios went quiet decades ago.",
    aside: "An archive of distant explorers.",
    fact: "Sojourner communicated with Earth through its companion, the Mars Pathfinder lander.",
  },
  {
    state: "arrival", label: "LAST KNOWN LOCATION", date: "ARES VALLIS · MARS",
    title: "A story waiting to be heard.", speaker: "MISSION ARCHIVE",
    text: "Here in the ancient flood channel of Ares Vallis sit two of the earliest pioneers: the Mars Pathfinder lander, and a tiny six-wheeled rover named Sojourner. Their radios have been quiet for decades… but what stories did they leave behind?",
    aside: "Let’s rewind the clock to 1997 and find out.",
    fact: "Pathfinder used a parachute, retrorockets, and airbags to reach the Martian surface.",
  },
  {
    state: "firstSteps", label: "CHAPTER 1", date: "JULY 4, 1997",
    title: "ARRIVAL ON MARS", speaker: "MISSION ARCHIVE",
    text: "July 4, 1997. After nearly seven months among the stars, Pathfinder and its little passenger are about to reach Mars. A world that once filled a room of scientists’ dreams now fills the window.",
    aside: "A little rover. A whole new world.",
    fact: "At about 10.6 kilograms, Sojourner was roughly the size of a microwave oven.",
  },
  {
    state: "entry", label: "ATMOSPHERIC ENTRY", date: "JULY 4, 1997 · ABOVE MARS",
    title: "Through the fire.", speaker: "MISSION ARCHIVE",
    text: "Outside the shell, flames roar against the heat shield. Mars rushes closer. Inside, a small explorer waits through every tremble, carrying the hopes of a world far away.",
    aside: "Seven months of silence. A few extraordinary minutes.",
    fact: "A heat shield protected Pathfinder during atmospheric entry.",
  },
  {
    state: "window", label: "INSIDE PATHFINDER", date: "A FIRST GLIMPSE OF MARS",
    title: "Is that really Mars?", speaker: "SOJOURNER",
    text: "Pathfinder… is that it? The red world they showed me back home? It’s so big. Look at all those mountains! Do you think there are rocks down there that nobody has ever seen?",
    aside: "A little hand against the glass. A whole planet beyond it.",
    fact: "Sojourner traveled to Mars aboard the Pathfinder spacecraft.",
  },
  {
    state: "wonder", label: "A LITTLE ROVER, A BIG DREAM", date: "JUST BEFORE THE LANDING",
    title: "I’m ready.", speaker: "SOJOURNER",
    text: "I wish they could see what I can see. I’ll show them, won’t I? Every little stone. Every bit of this place. Stay close, Pathfinder. I’m ready to begin.",
    aside: "Below, a new world waits. For now, there is only wonder.",
    fact: "The rover’s mission included studying Martian rocks and soil.",
  },
] as const;
