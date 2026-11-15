import MissionPopupGate from "@/components/MissionPopupGate";
import RoverGame from "@/components/rover/RoverGame";

export default function Mission1Page() {
  return <MissionPopupGate mission="barnacle"><RoverGame missionNumber={1} /> </MissionPopupGate>;
}
