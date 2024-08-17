import { ButtonGroup, ProgressBar, Stack } from "react-bootstrap";
import AnimationControlButton from "./AnimationControlButton";
import { useAnimationContext } from "../contexts/animationContext";
import { ANIM_CONTROLS } from "../utilities/constants";

const timeSteps = ["0%", "25%", "50%", "75%", "100%"];

const AnimationControls = () => {
    const animationContext = useAnimationContext();

    // const timeSteps: number[] = animationContext.frameCount

    const handleClick = (control: string) => {
        control === "play-pause" ? animationContext.setAnimationState(true) : animationContext.setAnimationState(false);
        control === "next" ? animationContext.setAnimationFrame(animationContext.animationFrame + 1) : "";
        control === "prev" ? animationContext.setAnimationFrame(animationContext.animationFrame - 1) : "";
        control === "first" ? animationContext.setAnimationFrame(0) : "";
        control === "last" ? animationContext.setAnimationFrame(animationContext.frameCount - 1) : "";
    };

    return (
        <>
            <Stack direction="vertical">
                <Stack className="d-flex justify-content-between mx-2 mt-2" direction="horizontal">
                    {timeSteps.map((ts) => (
                        <span key={ts}>{ts}</span>
                    ))}
                </Stack>

                <ProgressBar striped variant="info" className="m-2" now={25} />

                <ButtonGroup className="mx-2 mb-2">
                    {ANIM_CONTROLS.map((c) => (
                        <AnimationControlButton key={c} type={c} onClick={() => handleClick(c)} />
                    ))}
                </ButtonGroup>
            </Stack>
        </>
    );
};

export default AnimationControls;
