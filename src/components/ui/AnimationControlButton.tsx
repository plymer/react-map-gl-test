import { MdFirstPage, MdLastPage, MdNavigateBefore, MdNavigateNext, MdPause, MdPlayArrow } from "react-icons/md";
import Button from "./Button";

interface Props {
  onClick: () => void;
  className: string;
  type: string;
}

const AnimationControlButton = ({ onClick, type, className }: Props) => {
  return (
    <Button id={type} onClick={onClick} className={className}>
      {type === "last" ? <MdFirstPage className="text-center h-6 w-6" /> : ""}
      {type === "prev" ? <MdNavigateBefore className="h-6 w-6" /> : ""}
      {type === "play" ? <MdPlayArrow className="h-6 w-6" /> : ""}
      {type === "pause" ? <MdPause className="h-6 w-6" /> : ""}
      {type === "next" ? <MdNavigateNext className="h-6 w-6" /> : ""}
      {type === "first" ? <MdLastPage className="h-6 w-6" /> : ""}
    </Button>
  );
};

export default AnimationControlButton;
