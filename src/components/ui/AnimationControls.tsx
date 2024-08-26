import { useEffect, useState } from "react";
import { ButtonGroup, ButtonToolbar, ProgressBar, Stack, Form } from "react-bootstrap";

import AnimationControlButton from "./AnimationControlButton";
import { useAnimationContext } from "../../contexts/animationContext";
import { delegateKeyDown, getNewFrame, ANIM_CONTROLS } from "../../utilities/animationHandler";
import { makeISOTimeStamp } from "../../utilities/GeoMetSetup";

const AnimationControls = () => {
    const animationContext = useAnimationContext();

    const [startTime, setStartTime] = useState(makeISOTimeStamp(animationContext.startTime, "display"));
    const [endTime, setEndTime] = useState(makeISOTimeStamp(animationContext.endTime, "display"));
    const [loopID, setLoopID] = useState<number>();

    // set up the event listener to handle keyboard input for animation controls
    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            handleClick(delegateKeyDown(e));
        });
    }, []);

    useEffect(() => {
        setStartTime(makeISOTimeStamp(animationContext.startTime, "display"));
        setEndTime(makeISOTimeStamp(animationContext.endTime, "display"));
    }, [animationContext]);

    useEffect(() => {
        // calculate the milliseconds per frame
        // if wwe are on the last frame, hold for 3 seconds before starting the loop again
        const delay: number = animationContext.currentFrame === animationContext.frameCount - 1 ? 3000 : 1000 / animationContext.frameRate;

        if (animationContext.animationState === true) {
            setLoopID(setInterval(() => animationContext.setCurrentFrame(getNewFrame(animationContext.frameCount, animationContext.currentFrame, 1)), delay));
        } else {
            clearInterval(loopID);
        }

        return () => {
            clearInterval(loopID);
        };
    }, [animationContext.animationState, animationContext.currentFrame]);

    useEffect(() => {
        if (animationContext.animationState === false) {
            clearInterval(loopID);
            animationContext.setCurrentFrame(getNewFrame(animationContext.frameCount, animationContext.currentFrame));
        }
    }, [animationContext.animationState]);

    /**
     * controls the animation based on user input
     * @param control the string passed as the command for the animation
     */
    const handleClick = (control: string) => {
        // in strict mode, MOUSE CLICKS generate ONE console.log, KEYBOARD input generates TWO
        console.log(control);
        switch (control) {
            case "play-pause":
                if (animationContext.animationState === true) {
                    animationContext.setAnimationState(false);
                } else {
                    animationContext.setAnimationState(true);
                }

                break;

            case "next":
                animationContext.setAnimationState(false);
                animationContext.setCurrentFrame(getNewFrame(animationContext.frameCount, animationContext.currentFrame, 1));
                break;

            case "prev":
                animationContext.setAnimationState(false);
                animationContext.setCurrentFrame(getNewFrame(animationContext.frameCount, animationContext.currentFrame, -1));
                break;

            case "first":
                animationContext.setAnimationState(false);
                animationContext.setCurrentFrame(getNewFrame(animationContext.frameCount, animationContext.frameCount - 1));
                break;

            case "last":
                animationContext.setAnimationState(false);
                animationContext.setCurrentFrame(getNewFrame(animationContext.frameCount, 0));
                break;
        }
    };

    const animationProgress = (animationContext.currentFrame / (animationContext.frameCount - 1)) * 100;

    return (
        <>
            <Stack direction="vertical" className="mx-2">
                <Stack className="d-flex justify-content-between" direction="horizontal">
                    <span key="start">{startTime}</span>
                    <span key="end">{endTime}</span>
                </Stack>

                <ProgressBar striped variant="primary" className="my-2" now={animationProgress} animated={false} />

                <ButtonToolbar className="d-flex justify-content-between mb-2">
                    <ButtonGroup>
                        {ANIM_CONTROLS.map((c) => (
                            <AnimationControlButton key={c} type={c} onClick={() => handleClick(c)} />
                        ))}
                        <div>{animationContext.currentFrame}</div>
                    </ButtonGroup>

                    <Stack direction="horizontal" className="ms-2">
                        <Form.Label>FPS:</Form.Label>
                        <Form.Control max={8} min={3} defaultValue={animationContext.frameRate} type="number" onChange={(e) => animationContext.setFrameRate(parseInt(e.target.value))} />
                    </Stack>
                </ButtonToolbar>
            </Stack>
        </>
    );
};

export default AnimationControls;
