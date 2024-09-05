import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
  MdPause,
  MdPlayArrow,
} from "react-icons/md";
import Button from "./Button";

interface Props {
  onClick: () => void;
  type: string;
}

const AnimationControlButton = ({ onClick, type }: Props) => {
  return (
    <Button
      id={type}
      type="button"
      onClick={onClick}
      // variant={"animation"}
    >
      {type === "last" ? <MdFirstPage className="h-6 w-6" /> : ""}
      {type === "prev" ? <MdNavigateBefore className="h-6 w-6" /> : ""}
      {type === "play" ? <MdPlayArrow className="h-6 w-6" /> : ""}
      {type === "pause" ? <MdPause className="h-6 w-6" /> : ""}
      {type === "next" ? <MdNavigateNext className="h-6 w-6" /> : ""}
      {type === "first" ? <MdLastPage className="h-6 w-6" /> : ""}
      <span className="sr-only">{type}</span>
    </Button>
  );
};

export default AnimationControlButton;
