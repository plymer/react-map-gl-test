import { IAnimationContext } from "../contexts/animationContext";
import { ANIMATION_KEYBINDS } from "./keybinds";

// type of buttons for controlling the animation
export const ANIM_CONTROLS: string[] = ["last", "prev", "play-pause", "next", "first"];

/**
 * helper function to handle the logic for looping through the animation
 * @param frame the animation frame that has been requested
 * @param delta the optional modifier (1, -1) that we will mutate our request with
 */
export const getNewFrame = (frameCount: number, frame: number, delta?: number) => {
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
 * this is currently creating an odd behaviour where each input only works once in each direction
 * @param event the KeyboardEvent passed from the event listener attached to the window
 * @param context the context passed from the AnimationControls component that should allow us to update the context
 */
export const delegateKeyDown = (event: KeyboardEvent, context: IAnimationContext) => {
    console.log(event.code, context);
    // check that the input matches our animation keybinds and prevent the default action
    ANIMATION_KEYBINDS.map((c) => (c.code === event.code ? (event.preventDefault(), delegateAction(c.command, context)) : ""));
};

export const delegateAction = (command: string, context: IAnimationContext, playClicked: boolean = false) => {
    // console.log(command, context);
    if (context)
        switch (command) {
            case "play-pause":
                if (playClicked) {
                    console.log(playClicked);
                } else {
                    console.log(playClicked);
                    // return true;
                }

                break;

            case "next":
                context.setAnimationState(false);
                context.setCurrentFrame(getNewFrame(context.frameCount, context.currentFrame, 1));
                break;

            case "prev":
                context.setAnimationState(false);
                context.setCurrentFrame(getNewFrame(context.frameCount, context.currentFrame, -1));
                break;

            case "first":
                context.setAnimationState(false);
                context.setCurrentFrame(getNewFrame(context.frameCount, context.frameCount - 1));
                break;

            case "last":
                context.setAnimationState(false);
                context.setCurrentFrame(getNewFrame(context.frameCount, 0));
                break;
        }
};
