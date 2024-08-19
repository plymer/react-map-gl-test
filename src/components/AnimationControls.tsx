import { useEffect, useState } from "react";
import { ButtonGroup, ButtonToolbar, ProgressBar, Stack, Form } from "react-bootstrap";

import AnimationControlButton from "./AnimationControlButton";
import { useAnimationContext } from "../contexts/animationContext";
import { useClockContext } from "../contexts/clockContext";
import { ANIM_CONTROLS } from "../utilities/constants";
import { makeISOTimeStamp } from "../utilities/GeoMetSetup";

const AnimationControls = () => {
  const animationContext = useAnimationContext();
  const clockContext = useClockContext();

  const [startTime, setStartTime] = useState(makeISOTimeStamp(animationContext.startTime, "display"));
  const [endTime, setEndTime] = useState(makeISOTimeStamp(animationContext.endTime, "display"));
  const [playClicked, setPlayClicked] = useState<boolean>(false);
  const [loopID, setLoopID] = useState<number>();

  useEffect(() => {
    setStartTime(makeISOTimeStamp(animationContext.startTime, "display"));
    setEndTime(makeISOTimeStamp(animationContext.endTime, "display"));
  }, [clockContext.time]);

  useEffect(() => {
    // milliseconds per frame
    const delay: number =
      animationContext.currentFrame === animationContext.frameCount - 1 ? 2000 : 1000 / animationContext.frameRate;

    if (playClicked) {
      setLoopID(setInterval(() => setFrameTo(animationContext.currentFrame, 1), delay));
    } else {
      clearInterval(loopID);
    }

    return () => {
      clearInterval(loopID);
    };
  }, [playClicked, animationContext.currentFrame]);

  /**
   * helper function to handle the logic for looping through the animation
   * @param frame the animation frame that has been requested
   * @param delta the optional modifier (1, -1) that we will mutate our request with
   */
  const setFrameTo = (frame: number, delta?: number) => {
    const maxFrame = animationContext.frameCount - 1;
    const minFrame = 0;

    if (delta) frame = frame + delta;

    if (frame > maxFrame) {
      frame = minFrame;
    } else if (frame < minFrame) {
      frame = maxFrame;
    }

    // update the context with our new valid frame
    animationContext.setCurrentFrame(frame);
  };

  /**
   * controls the animation based on user input
   * @param control the string passed as the command for the animation
   */
  const handleClick = (control: string) => {
    switch (control) {
      case "play-pause":
        if (playClicked) {
          setPlayClicked(false);
        } else {
          setPlayClicked(true);
        }

        break;

      case "next":
        animationContext.setAnimationState(false);
        setFrameTo(animationContext.currentFrame, 1);
        break;

      case "prev":
        animationContext.setAnimationState(false);
        setFrameTo(animationContext.currentFrame, -1);
        break;

      case "first":
        animationContext.setAnimationState(false);
        setFrameTo(animationContext.frameCount - 1);
        break;

      case "last":
        animationContext.setAnimationState(false);
        setFrameTo(0);
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
            <Form.Control
              max={8}
              min={3}
              defaultValue={animationContext.frameRate}
              type="number"
              onChange={(e) => animationContext.setFrameRate(parseInt(e.target.value))}
            />
          </Stack>
        </ButtonToolbar>
      </Stack>
    </>
  );
};

export default AnimationControls;
