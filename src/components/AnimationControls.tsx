import { useEffect, useState } from "react";
import { ButtonGroup, ButtonToolbar, ProgressBar, Stack, Form } from "react-bootstrap";

import AnimationControlButton from "./AnimationControlButton";
import { useAnimationContext } from "../contexts/animationContext";
import { useClockContext } from "../contexts/clockContext";
import { ANIM_CONTROLS } from "../utilities/constants";
import { makeISOTimeStamp } from "../utilities/GeoMetSetup";
import { useSatelliteContext } from "../contexts/satelliteContext";

const AnimationControls = () => {
    const satelliteContext = useSatelliteContext();
    const animationContext = useAnimationContext();
    const clockContext = useClockContext();

    const [startTime, setStartTime] = useState(makeISOTimeStamp(satelliteContext.oldestTime, "display"));
    const [endTime, setEndTime] = useState(makeISOTimeStamp(satelliteContext.newestTime, "display"));

    useEffect(() => {
        setStartTime(makeISOTimeStamp(satelliteContext.oldestTime, "display"));
        setEndTime(makeISOTimeStamp(satelliteContext.newestTime, "display"));
    }, [clockContext.time]);

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
                animationContext.setCurrentFrame(animationContext.currentFrame + 1);
                break;
            case "prev":
                animationContext.setAnimationState(false);
                animationContext.setCurrentFrame(animationContext.currentFrame - 1);
                break;
            case "first":
                animationContext.setAnimationState(false);
                animationContext.setCurrentFrame(animationContext.frameCount - 1);
                break;
            case "last":
                animationContext.setAnimationState(false);
                animationContext.setCurrentFrame(0);
                break;
        }
    };

    const animationProgress = (animationContext.currentFrame / (animationContext.frameCount - 1)) * 100;

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
