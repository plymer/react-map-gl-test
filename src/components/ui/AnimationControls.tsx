import { useCallback, useEffect, useState } from "react";
import { ButtonGroup, ButtonToolbar, ProgressBar, Stack, Form } from "react-bootstrap";

import AnimationControlButton from "./AnimationControlButton";
import { useAnimationContext } from "../../contexts/animationContext";

import { makeISOTimeStamp } from "../../utilities/GeoMetSetup";

const AnimationControls = () => {
  const animationContext = useAnimationContext();

  const [startTime, setStartTime] = useState(makeISOTimeStamp(animationContext.startTime, "display"));
  const [endTime, setEndTime] = useState(makeISOTimeStamp(animationContext.endTime, "display"));
  const [loopID, setLoopID] = useState<number>();

  // type of buttons for controlling the animation
  const ANIM_CONTROLS: string[] = ["last", "prev", "play", "pause", "next", "first"];

  /**
   * helper function to handle the logic for looping through the animation
   * @param frame the animation frame that has been requested
   * @param delta the optional modifier (1, -1) that we will mutate our request with
   */
  const getNewFrame = (frameCount: number, frame: number, delta?: number) => {
    const maxFrame = frameCount - 1;
    const minFrame = 0;

    if (delta) frame = frame + delta;

    if (frame > maxFrame) {
      frame = minFrame;
    } else if (frame < minFrame) {
      frame = maxFrame;
    }

    // we have mutated the frame number and are returning it to the caller
    return frame;
  };

  /**
   * controls the animation based on user input
   * @param control the string passed as the command for the animation
   */
  const doAnimateCommand = (control: string) => {
    switch (control) {
      case "play":
        animationContext.setAnimationState(true);
        break;

      case "pause":
        animationContext.setAnimationState(false);
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

  /**
   *  Used to translate keyboard input into a useable command string to animate the data
   * @param code a string returned by a KeyboardEvent.code that pertains to the key pressed by the user
   * @returns a string that can be used by the doAnimateCommand method to change the animation state and timestep
   */
  const translateKeyboardInput = (code: string) => {
    switch (code) {
      case "Space":
        return animationContext.animationState === false ? "play" : "pause";
      case "Comma":
        return "prev";
      case "Period":
        return "next";
      default:
        return "";
    }
  };

  /**
   * set up the method that is called by the event listener for keyboard shortcuts in the app
   */
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const translated = translateKeyboardInput(event.code);
      translated != "" ? doAnimateCommand(translated) : "";
    },
    [animationContext.currentFrame, animationContext.animationState]
  );

  /**
   * add the event listeners to the html document that listen for user keyboard input and send it to our callback
   */
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  /**
   * updates our start and end times every time the data updates
   */
  useEffect(() => {
    setStartTime(makeISOTimeStamp(animationContext.startTime, "display"));
    setEndTime(makeISOTimeStamp(animationContext.endTime, "display"));
  }, [animationContext]);

  useEffect(() => {
    // calculate the milliseconds per frame
    // if wwe are on the last frame, hold for 3 seconds before starting the loop again
    const delay: number =
      animationContext.currentFrame === animationContext.frameCount - 1 ? 3000 : 1000 / animationContext.frameRate;

    if (animationContext.animationState === true) {
      setLoopID(
        setInterval(
          () =>
            animationContext.setCurrentFrame(
              getNewFrame(animationContext.frameCount, animationContext.currentFrame, 1)
            ),
          delay
        )
      );
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

  const buildButton = (command: string, index: number) => {
    var button: JSX.Element = (
      <AnimationControlButton key={index} type={command} onClick={() => handleClick(command)} />
    );
    if (command === "play" && animationContext.animationState === true) {
      return "";
    } else if (command === "pause" && animationContext.animationState === false) {
      return "";
    } else {
      return button;
    }
  };

  /**
   * controls the animation based on user input
   * @param control the string passed as the command for the animation
   */
  const handleClick = (control: string) => {
    // in strict mode, MOUSE CLICKS generate ONE console.log, KEYBOARD input generates TWO
    console.log(control);
    doAnimateCommand(control);
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
            {ANIM_CONTROLS.map((c, index) => buildButton(c, index))}
            <div>{animationContext.currentFrame}</div>
          </ButtonGroup>

          <Stack direction="horizontal" className="ms-2">
            <Form.Label>FPS:</Form.Label>
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
