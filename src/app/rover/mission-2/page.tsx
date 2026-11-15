import MissionPopupGate from "@/components/MissionPopupGate";
import RoverGame from "@/components/rover/RoverGame";

export default function Mission2Page() {
  return <MissionPopupGate mission="yogi"><RoverGame missionNumber={2} /> </MissionPopupGate>;
}
