import { useState, useRef, useCallback } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import api from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";
import KeyValue from "./KeyValue";
import Tooltip from "@mui/material/Tooltip";
import "./Annotation.css";
import BoundingBox from "./BoundingBox";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import DeleteIcon from "@mui/icons-material/Delete";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import Button from "@mui/material/Button";
// import FileDownload from "@mui/icons-material/FileDownload";
// import exportData from "../../utils/export_json";
import { useSnackbar } from "notistack";
// import { FileUploader } from "react-drag-drop-files";
// import { FileUpload } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import Magnifier from "react-magnifier";

import axios from "axios";

function Annotation() {
  //get path parameter
  let { imageset_id } = useParams();

  const [images, setImages] = useState([]);
  const [labels, setlabels] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);
  const [ctrlKeyActive, setCtrlKeyActive] = useState(false);
  const firstLabelInputRef = useRef(null);

  const [bbox, setBbox] = useState([]);

  const [activeInput, setActiveInput] = useState(0);
  const [initialState, setInitialState] = useState({});
  // const [label2word, setLabel2word] = useState({});
  const [data, setData] = useState(initialState);
  const [keyValueDatabase, setKeyValueDatabase] = useState({});
  const navigate = useNavigate();
  const [magnifyMode, setMagnifyMode] = useState(false);
  const [arrowButtonDisabled, setArrowButtonDisabled] = useState(false);
  const prevActiveRef = useRef();
  const { enqueueSnackbar } = useSnackbar();
  const add_bbox = (new_bbox) => {
    let filtered_bbox = bbox.filter(
      (item) => item.word_id !== new_bbox.word_id
    );
    setBbox([...filtered_bbox, new_bbox]);
  };

  const fetchBbox = useCallback(async () => {
    if (images.length === 0) return;
    setLoading(true);
    try {
      const res = await api.get(
        "/api/bbox/" + images[active].id + "/" + imageset_id
      );
      setBbox(res.data.words);
      // setData(res.data.annotation);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [active, images, imageset_id]);

  // TODO: Understand useCallback
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        onClickPrev();
      } else if (event.key === "ArrowRight") {
        onClickNext();
      } else if (event.key === "Control") {
        setCtrlKeyActive(true);
      } else if (event.key === "d") {
        onClickNext();
      } else if (event.key === "a") {
        onClickPrev();
      } else if (event.key === "q") {
        onDropImage();
      } else if (event.key === "s") {
        saveAnnotation();
      }
    },
    [images, active, arrowButtonDisabled, loading]
  );

  const handleKeyUp = useCallback(
    (event) => {
      if (event.key === "Control") {
        setCtrlKeyActive(false);
      }
    },
    [images, active, arrowButtonDisabled, loading]
  );

  useEffect(() => {
    // when first time load, prevActiveRef.current is  first image
    prevActiveRef.current = 0;

    (async () => {
      let res = await api.get(`/api/imageset/${imageset_id}`);
      setImages(res.data["imageset"]);
      setlabels(res.data["labels"]);

      let initial_state = {};
      res.data["labels"].forEach((label) => {
        initial_state[label.name] = {
          text: "",
          word_ids: [],
          label_name: label.name,
        };
      });
      setInitialState(initial_state);
      setData(initial_state);
      setActiveInput(res.data["labels"][0].id);
    })();
  }, [imageset_id]);

  useEffect(() => {
    // // allow to change annotation example by using left and right arrow key
    console.log("Adding event listner");
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
  useEffect(() => {
    (async () => {
      await fetchBbox();
    })();
  }, [images, fetchBbox]);

  useEffect(() => {
    (async function () {
      if (images.length === 0) return;
      // await saveAnnotation();
      let imageName = images[prevActiveRef.current].path;
      setKeyValueDatabase({
        ...keyValueDatabase,
        [imageName]: { ...data, bbox: bbox },
      });
      let newImage = images[active].path;
      // clear old bounding box so that it will not show up when new bounding box is loading in next image
      setBbox([]);

      if (keyValueDatabase[newImage]) {
        // if the image has been already partially annotated or bounding box is already cached
        setData(keyValueDatabase[newImage]);
        setBbox([...keyValueDatabase[newImage].bbox]);
      } else {
        await fetchBbox();
      }
      // to access the previous active image in the next activeImage change
      prevActiveRef.current = active;

      // refocus to the first label
      setActiveInput(Object.keys(data)[0]);
      firstLabelInputRef.current.focus();
    })();

    var el = document.querySelector(".thumbnail-active");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [active]);

  const onClickBoundingBox = ({ word_id, text }) => {
    if (deleteMode) {
      // delete word from teh backend
      (async () => {
        try {
          await api.delete(`/api/delete_word/${word_id}`);
          let filtered_bbox = bbox.filter((item) => item.word_id !== word_id);
          setBbox(filtered_bbox);
        } catch (error) {
          console.log(error);
        }
      })();
    } else {
      setArrowButtonDisabled(true);
      setData({
        ...data,
        [activeInput]: {
          text: data[activeInput].text + " " + text,
          word_ids: [...data[activeInput].word_ids, word_id],
          label_name: data[activeInput].label_name,
        },
      });
    }

    // console.log("data", data);
  };

  const saveAnnotation = async () => {
    // same annotation for current image
    try {
      let labeling = {};
      Object.keys(data).forEach((key) => {
        labeling[key] = data[key].word_ids;
      });
      const res = await api.post("/api/annotate/", {
        image_id: images[prevActiveRef.current].id,
        imageset_id: imageset_id,
        labeling: labeling,
      });
    } catch (error) {
      console.log(error);
    }
    setArrowButtonDisabled(false);
  };

  //my code starts here
  useEffect(() => {
    const fetchAnnotations = async (image_id, imageset_id) => {
      try {
        const response = await api.get(`/api/annotations/${image_id}/${imageset_id}`);
        console.log("Annotations fetched HERE!!!:", response.data.annotations);
      } catch (error) {
        console.error("Error fetching annotations:", error);
      }
    };
  
    if (imageset_id && images.length > 0) {
      const image_id = images[active]?.id;
      fetchAnnotations(image_id, imageset_id);
    }
  }, [imageset_id, images, active]);  
  //my code ends here

  const resetAnnotation = () => {
    (async () => {
      await api.delete(`/api/annotation/${imageset_id}/${images[active].id}`);
      setData(initialState);
    })();
  };

  const onClickNext = () => {
    if (!arrowButtonDisabled && !loading) {
      // setArrowButtonDisabled(true);
      setActive((active + 1) % images.length);
    } else {
      enqueueSnackbar("Save the current annotation first", {
        variant: "warning",
      });
    }
  };

  const onClickPrev = () => {
    if (!arrowButtonDisabled && !loading) {
      // setArrowButtonDisabled(true);
      setActive((active + images.length - 1) % images.length);
    } else {
      enqueueSnackbar("Save the current annotation first", {
        variant: "warning",
      });
    }
  };

  const onDropImage = async () => {
    try {
      await api.delete(`/api/image/${images[active].id}`);
      let filtered_images = images.filter((image, index) => index !== active);

      console.log("Drop image", filtered_images.length, active);

      if (filtered_images.length === 0) {
        navigate("/documents");
      }

      if (active === filtered_images.length) {
        setActive(active - 1);
      }

      setImages(filtered_images);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {images.length === 0 && (
        <div className="upload-input-container">
          <CircularProgress color="secondary" />
        </div>
      )}
      {images.length > 0 && (
        <div className="annotator">
          <div className="annotator-top-container">
            <IconButton
              onClick={onClickPrev}
              disabled={loading || arrowButtonDisabled}
              // className="arrow-button arrow-left"
            >
              <KeyboardArrowLeftIcon
                className={
                  loading || arrowButtonDisabled
                    ? "arrow-button arrow-left arrow-disabled"
                    : "arrow-button arrow-left"
                }
                fontSize="large"
              />
              {/* <ArrowBackIosIcon /> */}
            </IconButton>

            {magnifyMode ? (
              <div className="fullImage">
                <Magnifier
                  src={
                    process.env.REACT_APP_BACKEND_URL +
                    "/api/image/" +
                    images[active].path
                  }
                />
              </div>
            ) : (
              <BoundingBox
                img={
                  process.env.REACT_APP_BACKEND_URL +
                  "/api/image/" +
                  images[active].path
                }
                addBbox={add_bbox}
                setBbox={setBbox}
                bboxes={bbox}
                onClickBoundingBox={onClickBoundingBox}
                ocr_loading={loading}
                deleteMode={deleteMode}
                ctrlKeyActive={ctrlKeyActive}
                imageId={images[active].id}
              />
            )}

            <div className="data">
              {loading ? (
                <CircularProgress color="secondary" />
              ) : (
                <KeyValue
                  setArrowButtonDisabled={setArrowButtonDisabled}
                  firstLabelInputRef={firstLabelInputRef}
                  setActiveInput={setActiveInput}
                  data={data}
                  setData={setData}
                />
              )}
            </div>
            <IconButton
              onClick={onClickNext}
              disabled={loading || arrowButtonDisabled}
            >
              <KeyboardArrowRightIcon
                className={
                  loading || arrowButtonDisabled
                    ? "arrow-button arrow-right arrow-disabled"
                    : "arrow-button arrow-right"
                }
                fontSize="large"
              />
            </IconButton>
          </div>
          <div className="bottom-container">
            <div className="options">
              <Tooltip title={"Enter delete mode"}>
                <DeleteIcon
                  className="arrow-button arrow-right"
                  fontSize="large"
                  style={{ color: deleteMode ? "red" : "black" }}
                  onClick={() => {
                    setDeleteMode(!deleteMode);
                  }}
                />
              </Tooltip>
              <Tooltip title={"Reset"}>
                <RestartAltIcon
                  className="arrow-button arrow-right"
                  fontSize="large"
                  onClick={resetAnnotation}
                />
              </Tooltip>
              <Tooltip title={"Magnify"}>
                <ZoomInIcon
                  className="arrow-button arrow-right"
                  fontSize="large"
                  onClick={() => setMagnifyMode(!magnifyMode)}
                />
              </Tooltip>
              <Tooltip title={"Discard this image"}>
                <NotInterestedIcon
                  className="arrow-button arrow-right"
                  fontSize="large"
                  onClick={onDropImage}
                />
              </Tooltip>
              <Tooltip title={"Save annotation"}>
                <CheckCircleOutlineIcon
                  className="arrow-button arrow-right"
                  fontSize="large"
                  onClick={saveAnnotation}
                />
              </Tooltip>
            </div>
            <div className="thumbnail">
              <div className="thumbnail-inner">
                {images.map((image, index) => {
                  return (
                    <Tooltip key={index} title={image.path}>
                      <div
                        className={`thumbnail-item ${
                          index === active ? "thumbnail-active" : "inactive"
                        }`}
                        onClick={() => {
                          // setActive(index);
                          if (!arrowButtonDisabled && !loading) {
                            // setArrowButtonDisabled(true);
                            setActive(index);
                          } else {
                            enqueueSnackbar(
                              "Save the current annotation first",
                              { variant: "warning" }
                            );
                          }
                        }}
                      >
                        <img
                          alt="original"
                          loading="lazy"
                          src={
                            process.env.REACT_APP_BACKEND_URL +
                            "/api/image/" +
                            image.path
                          }
                        ></img>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Annotation;
