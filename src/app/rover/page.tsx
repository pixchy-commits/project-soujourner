import MissionPopupGate from "@/components/MissionPopupGate";
import RoverGame from "@/components/rover/RoverGame";

export default function RoverPage() {
  return <MissionPopupGate mission="barnacle"><RoverGame missionNumber={1} /> </MissionPopupGate>;
}
