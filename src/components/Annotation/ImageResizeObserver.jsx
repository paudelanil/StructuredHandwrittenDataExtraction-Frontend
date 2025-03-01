import { useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";

const ResizeObserver = ({
  path,
  setImageWidth,
  setImageHeight,
  setImageTopLeft,
  imageTopLeft,
  addBbox,
  draggingActive,
  setDraggingActive,
  tref,
  ctrlKeyActive,
}) => {
  const { width, height, ref } = useResizeDetector();
  const [downPosition, setDownPosition] = useState([0, 0]);
  const [upPosition, setUpPosition] = useState([0, 0]);

  // first render ko issue solve garna lai text lai empty string ma rakheko
  const [newBbox, setNewBbox] = useState({ text: "" });

  useEffect(() => {
    if (draggingActive) {
      let top_left = [
        Math.min(downPosition[0], upPosition[0]),
        Math.min(downPosition[1], upPosition[1]),
      ];
      let bottom_right = [
        Math.max(downPosition[0], upPosition[0]),
        Math.max(downPosition[1], upPosition[1]),
      ];
      // console.log("top left", top_left);
      // console.log("bottom right", bottom_right);
      addBbox({
        word_id: -1,
        text: "New Word",
        posx_0: (top_left[0] / width) * 1000,
        posy_0: (top_left[1] / height) * 1000,
        posx_1: (bottom_right[0] / width) * 1000,
        posy_1: (bottom_right[1] / height) * 1000,
      });
    }
  }, [upPosition]);
  useEffect(() => {
    // this gives the position of the image from the top left of the browser window
    let imageRect = ref.current.getBoundingClientRect();
    //  to make it compatibale even with the scrolling, we have to add scrollY
    let topLeft = [imageRect.top + window.scrollY, imageRect.left];

    setImageWidth(width);
    setImageHeight(height);
    setImageTopLeft(topLeft);
  }, [width, height]);
  // return <Magnifier src={path} ref={ref} />
  return (
    <img
      style={{ pointerEvents: ctrlKeyActive ? "auto" : "none" }}
      onMouseMove={(e) => {
        let { scale, positionX, positionY } = tref.current.state;
        if (draggingActive) {
          setUpPosition([
            (e.clientX - imageTopLeft[1] - positionX) / scale,
            (e.clientY - imageTopLeft[0] - positionY) / scale,
          ]);
        }
      }}
      draggable={false}
      onMouseDown={(e) => {
        let { scale, positionX, positionY } = tref.current.state;
        // console.log("tref current state ", tref.current.state);
        // console.log("offset position", positionX, positionX);
        // console.log(
        //   "position",
        //   e.clientX - imageTopLeft[1],
        //   e.clientY - imageTopLeft[0]
        // );
        // console.log("image top left", imageTopLeft[0], imageTopLeft[1]);
        // console.log(
        //   "percentage",
        //   (e.clientX - imageTopLeft[1] - positionX) / (scale * width),
        //   (e.clientY - imageTopLeft[0] - positionY) / (scale * height)
        // );
        // console.log(
        //   "Actual position",
        //   (e.clientX - imageTopLeft[1] - positionX) / scale,
        //   (e.clientY - imageTopLeft[0] - positionY) / scale
        // );
        setDraggingActive(true);
        setDownPosition([
          (e.clientX - imageTopLeft[1] - positionX) / scale,
          (e.clientY - imageTopLeft[0] - positionY) / scale,
        ]);
      }}
      onMouseLeave={(e) => {
        setDraggingActive(false);
      }}
      onMouseUp={(e) => {
        let { scale, positionX, positionY } = tref.current.state;
        setDraggingActive(false);
        setUpPosition([
          (e.clientX - imageTopLeft[1] - positionX) / scale,
          (e.clientY - imageTopLeft[0] - positionY) / scale,
        ]);
      }}
      ref={ref}
      src={path}
    />
  );
};
export default ResizeObserver;
