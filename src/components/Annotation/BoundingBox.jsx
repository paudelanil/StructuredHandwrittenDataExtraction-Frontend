import ResizeObserver from "./ImageResizeObserver";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@idui/react-popover";
import DoneIcon from "@mui/icons-material/Done";
import CircleIcon from "@mui/icons-material/Circle";
import { useState, useRef } from "react";

import api from "../../utils/api";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "./boundingbox.scss";

function BoundingBox({
  img,
  bboxes,
  setBbox,
  addBbox,
  onClickBoundingBox,
  ocr_loading,
  deleteMode,
  ctrlKeyActive,
  imageId,
}) {
  // bboxes is an array of objects, object should at least bbox property:

  // {
  //   bbox: [topleftX, topLeftY, bottomRightX, bottomRightY],
  //   ...
  //   ...
  // }
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageTopLeft, setImageTopLeft] = useState([0, 0]);
  const [draggingActive, setDraggingActive] = useState(false);

  const [loading, setLoading] = useState(false);
  const tref = useRef(null);

  const handleKeyDown = async (event, b) => {
    //API request here
    event.stopPropagation();
    if (event.keyCode === 13) {
      console.log("Enter key pressed", event.target.value, b);
      setLoading(true);
      // -1 is used as id when creating new bouding box
      let new_word = b.word_id === -1;
      if (new_word) {
        try {
          let res = await api.post("/api/add_word/" + String(imageId), {
            text: event.target.value,
            bbox: [
              Math.floor(b.posx_0),
              Math.floor(b.posy_0),
              Math.floor(b.posx_1),
              Math.floor(b.posy_1),
            ],
          });
          console.log("wordid", res.data.word_id);
          setLoading(false);
          bboxes = bboxes.map((item) => {
            if (item.word_id === -1) {
              return {
                ...item,
                word_id: res.data.word_id,
                text: event.target.value,
              };
            }
            return item;
          });
          setBbox(bboxes);
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          await api.post("/api/update_word", {
            word_id: b.word_id,
            new_word_text: event.target.value,
          });

          bboxes = bboxes.map((item) => {
            if (item.word_id === b.word_id) {
              return { ...item, text: event.target.value };
            }
            return item;
          });
          setBbox(bboxes);

          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  return (
    <TransformWrapper
      ref={tref}
      panning={{ disabled: ctrlKeyActive ? true : false }}
    >
      <TransformComponent>
        <div className="fullImage">
          <ResizeObserver
            setImageHeight={setImageHeight}
            setImageWidth={setImageWidth}
            setImageTopLeft={setImageTopLeft}
            imageTopLeft={imageTopLeft}
            path={img}
            addBbox={addBbox}
            draggingActive={draggingActive}
            setDraggingActive={setDraggingActive}
            tref={tref}
            ctrlKeyActive={ctrlKeyActive}
          />
          {bboxes.map((b, idx) => {
            let item = [b.posx_0, b.posy_0, b.posx_1, b.posy_1];
            // if (idx == 0) {
            //   console.log("bbox map again");
            //   console.log(item);
            // }
            return (
              !ocr_loading && (
                <Popover
                  key={b.word_id}
                  enterDelay={200}
                  animation={{
                    animate: {
                      opacity: 1,
                      scale: 1,
                    },
                    exit: {
                      opacity: 0,
                      scale: 0.9,
                      transition: {
                        duration: 0.1,
                      },
                      zIndex: -1, // important!!
                    },
                    initial: {
                      opacity: 0,
                      scale: 0.9,
                    },
                  }}
                  content={
                    deleteMode ? (
                      "Click to delete"
                    ) : (
                      <div className="tooltip-container">
                        <input
                          placeholder={b.text}
                          onKeyDown={(event) => handleKeyDown(event, b)}
                        />
                        {loading ? (
                          <CircleIcon className="loading-icon" />
                        ) : (
                          <DoneIcon className="checkmark-icon" />
                        )}
                      </div>
                    )
                  }
                  // placement="top"
                  // onOpen={() => {
                  //   setLoading(false);
                  // }}
                  fitMaxHeightToBounds
                  fitMaxWidthToBounds
                  lazy
                  offset={[0, 0]}
                  onChangeOpen={function noRefCheck() {}}
                  onFocus={function noRefCheck() {}}
                >
                  {
                    <div
                      key={b.bbox}
                      className="bounding-box"
                      onClick={() => {
                        onClickBoundingBox(b);
                        console.log(b);
                      }}
                      style={{
                        // current draw gardai gareko bounding box ko lagi chai mouse event off garnu parcha
                        // haina vane mouse up event nai paudina image ma register vako mouseup le kinaki koi bela
                        // mouse up hune bela maa yo div huncha mathi img vanda mathi
                        pointerEvents:
                          b.word_id === -1 && draggingActive ? "none" : "auto",
                        position: "absolute",
                        left: `${(item[0] / 1000) * imageWidth}px`,
                        top: `${(item[1] / 1000) * imageHeight}px`,
                        width: `${((item[2] - item[0]) / 1000) * imageWidth}px`,
                        height: `${
                          ((item[3] - item[1]) / 1000) * imageHeight
                        }px`,
                        // transform: `scale(${2})`,
                        zIndex: 1010,
                      }}
                    ></div>
                  }
                </Popover>
              )
            );
          })}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}

export default BoundingBox;
