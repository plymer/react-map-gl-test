import { Button, ButtonGroup, ProgressBar, Stack } from "react-bootstrap";
import { MdFirstPage, MdLastPage, MdNavigateBefore, MdNavigateNext, MdPause, MdPlayArrow } from "react-icons/md";

const AnimationControls = () => {
  const timeSteps = ["0%", "25%", "50%", "75%", "100%"];
  return (
    <>
      <Stack direction="vertical">
        <Stack className="d-flex justify-content-between mx-2 mt-2" direction="horizontal">
          {timeSteps.map((ts) => (
            <span>{ts}</span>
          ))}
        </Stack>

        <ProgressBar striped variant="info" className="m-2" now={25} />

        <ButtonGroup className="mx-2 mb-2">
          <Button>
            <MdFirstPage />
            <span className="visually-hidden">Last Frame</span>
          </Button>
          <Button>
            <MdNavigateBefore />
            <span className="visually-hidden">Previous Frame</span>
          </Button>
          <Button>
            <MdPlayArrow />/<MdPause />
            <span className="visually-hidden">Play/Pause</span>
          </Button>
          <Button>
            <MdNavigateNext />
            <span className="visually-hidden">Next Frame</span>
          </Button>
          <Button>
            <MdLastPage />
            <span className="visually-hidden">Last Frame</span>
          </Button>
        </ButtonGroup>
      </Stack>
    </>
  );
};

export default AnimationControls;
