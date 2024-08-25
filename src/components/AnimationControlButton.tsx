import { Button } from "react-bootstrap";
import { MdFirstPage, MdLastPage, MdNavigateBefore, MdNavigateNext, MdPause, MdPlayArrow } from "react-icons/md";

interface Props {
    onClick: () => void;

    type: string;
}

const AnimationControlButton = ({ onClick, type }: Props) => {
    return (
        <>
            <Button id={type} onClick={onClick}>
                {type === "last" ? <MdFirstPage /> : ""}
                {type === "prev" ? <MdNavigateBefore /> : ""}
                {type === "play-pause" ? (
                    <>
                        <MdPlayArrow />
                        /
                        <MdPause />
                    </>
                ) : (
                    ""
                )}
                {type === "next" ? <MdNavigateNext /> : ""}
                {type === "first" ? <MdLastPage /> : ""}
                <span className="visually-hidden">{type} Frame</span>
            </Button>
        </>
    );
};

export default AnimationControlButton;
