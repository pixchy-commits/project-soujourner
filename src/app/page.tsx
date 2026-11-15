"use client";
﻿import { gameplayActivities } from "@/game/activities/GameplayActivities";
import Game from "@/game/Game";
export default function Page() { return <Game activities={gameplayActivities} />; }
