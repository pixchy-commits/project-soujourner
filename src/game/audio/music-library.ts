const root = "/audio/scott-buckley/";
const page = "https://www.scottbuckley.com.au/library/";
export const licensedMusic = {
 archive: { title: "Signal to Noise (No Piano Melody)", src: root + "signal-to-noise-no-melody.mp3", source: page + "signal-to-noise/" },
 discovery: { title: "Discovery", src: root + "discovery.mp3", source: page + "discovery/" },
 wonder: { title: "Adrift Among Infinite Stars", src: root + "adrift-among-infinite-stars.mp3", source: page + "adrift-among-infinite-stars/" },
 companion: { title: "First Snow", src: root + "first-snow.mp3", source: page + "first-snow/" },
 memory: { title: "Childhood", src: root + "childhood.mp3", source: page + "childhood/" },
 exploration: { title: "Tomorrow", src: root + "tomorrow.mp3", source: page + "tomorrow/" },
} as const;
