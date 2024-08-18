import { useEffect, useState } from "react";
import { ButtonGroup, ButtonToolbar, ProgressBar, Stack, Form } from "react-bootstrap";

import AnimationControlButton from "./AnimationControlButton";
import { useAnimationContext } from "../contexts/animationContext";
import { ANIM_CONTROLS } from "../utilities/constants";
import { makeISOTimeStamp } from "../utilities/GeoMetSetup";

const AnimationControls = () => {
    const animationContext = useAnimationContext();
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    useEffect(() => {
        setStartTime(makeISOTimeStamp(animationContext.timeStart));
        setEndTime(makeISOTimeStamp(animationContext.timeEnd));
    }, [animationContext.currentTime]);

    const handleClick = (control: string) => {
        switch (control) {
            case "play-pause":
                if (animationContext.animationState) {
                    animationContext.setAnimationState(false);
                } else {
                    animationContext.setAnimationState(true);
                }
                break;
            case "next":
                animationContext.setAnimationState(false);
                animationContext.setAnimationFrame(animationContext.animationFrame + 1);
                break;
            case "prev":
                animationContext.setAnimationState(false);
                animationContext.setAnimationFrame(animationContext.animationFrame - 1);
                break;
            case "first":
                animationContext.setAnimationState(false);
                animationContext.setAnimationFrame(animationContext.frameCount - 1);
                break;
            case "last":
                animationContext.setAnimationState(false);
                animationContext.setAnimationFrame(0);
                break;
        }
    };

    const animationProgress = (animationContext.animationFrame / (animationContext.frameCount - 1)) * 100;

    return (
        <>
            <Stack direction="vertical">
                <Stack className="d-flex justify-content-between mx-2 mt-2" direction="horizontal">
                    <span key="start">{startTime}</span>
                    <span key="end">{endTime}</span>
                </Stack>

                <ProgressBar striped variant="primary" className="m-2" now={animationProgress} />

                <ButtonToolbar className="d-flex justify-content-between mx-2 mb-2">
                    <ButtonGroup>
                        {ANIM_CONTROLS.map((c) => (
                            <AnimationControlButton key={c} type={c} onClick={() => handleClick(c)} />
                        ))}
                    </ButtonGroup>

                    <Stack direction="horizontal">
                        <Form.Label className="mx-2 text-center">FPS:</Form.Label>
                        <Form.Control max={20} min={3} defaultValue={animationContext.frameRate} type="number" onChange={(e) => animationContext.setFrameRate(parseInt(e.target.value))} />
                    </Stack>
                </ButtonToolbar>
            </Stack>
        </>
    );
};

export default AnimationControls;
