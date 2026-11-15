import MissionPopupGate from "@/components/MissionPopupGate";
import RoverGame from "@/components/rover/RoverGame";

export default function Mission3Page() {
  return <MissionPopupGate mission="yogi"><RoverGame missionNumber={3} /> </MissionPopupGate>;
}
