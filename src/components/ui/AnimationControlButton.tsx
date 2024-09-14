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

const buttonIcons = (type: string) => {
  switch (type) {
    case "last":
      return <ChevronFirst />;
    case "prev":
      return <ChevronLeft />;
    case "play":
      return <Play />;
    case "pause":
      return <Pause />;
    case "next":
      return <ChevronRight />;
    case "first":
      return <ChevronLast />;
  }
};

const AnimationControlButton = ({ onClick, type }: Props) => {
  return (
    <Button id={type} type="button" onClick={onClick}>
      {buttonIcons(type)}
      <span className="sr-only">{type}</span>
    </Button>
  );
};

export default AnimationControlButton;
