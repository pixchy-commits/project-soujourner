import MissionPopupGate from "@/components/MissionPopupGate";
import RoverGame from "@/components/rover/RoverGame";

export default function Mission4Page() {
  return <MissionPopupGate mission="yogi"><RoverGame missionNumber={4} /> </MissionPopupGate>;
}
