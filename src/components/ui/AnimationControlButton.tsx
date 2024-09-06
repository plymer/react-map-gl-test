import {
  Play,
  Pause,
  ChevronFirst,
  ChevronLeft,
  ChevronLast,
  ChevronRight,
} from "lucide-react";
import Button from "./Button";

interface Props {
  onClick: () => void;
  type: string;
}

const AnimationControlButton = ({ onClick, type }: Props) => {
  return (
    <Button id={type} type="button" onClick={onClick}>
      {type === "last" ? <ChevronFirst /> : ""}
      {type === "prev" ? <ChevronLeft /> : ""}
      {type === "play" ? <Play /> : ""}
      {type === "pause" ? <Pause /> : ""}
      {type === "next" ? <ChevronRight /> : ""}
      {type === "first" ? <ChevronLast /> : ""}
      <span className="sr-only">{type}</span>
    </Button>
  );
};

export default AnimationControlButton;
