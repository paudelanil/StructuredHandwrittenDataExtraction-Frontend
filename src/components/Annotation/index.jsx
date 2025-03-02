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
  let { folder_id } = useParams();

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

  // const fetchBbox = useCallback(async () => {
  //   if (images.length === 0) return;
  //   setLoading(true);
  //   try {
  //     const res = await api.get(
  //       "/api/bbox/" + images[active].id + "/" + folder_id
  //     );
  //     setBbox(res.data.words);
  //     // setData(res.data.annotation);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setLoading(false);
  // }, [active, images, folder_id]);
  const fetchBbox = useCallback(async () => {
    if (images.length === 0) return; // If no images, exit early
    setLoading(true); // Set loading state to true
  
    try {
      const res = await api.get(
        `/api/annotations/${images[active].id}/${folder_id}`
      );
  
      const annotations = res.data; // Expected to be an array of objects
  
      // Group words by their label
      let groupedWords = {};
      annotations.forEach(({ word, label }) => {
        if (!groupedWords[label]) {
          groupedWords[label] = [];
        }
        groupedWords[label].push(word); // Group words under their label
      });
  
      // Convert to an array of objects { label, words }
      const formattedBbox = Object.keys(groupedWords).map((label) => ({
        label,
        words: groupedWords[label].join(" "), // Join words with a space between them
      }));

      console.log("formattedBbox:", formattedBbox);

      setBbox(formattedBbox); // Update the state with the formatted bounding box data
    } catch (error) {
      console.error("Error fetching annotations:", error); // Log any error
    } finally {
      setLoading(false); // Ensure loading state is set to false once the request is complete
    }
  }, [images, active, folder_id]);
  
  

  // // Fetch annotations from API
  // const fetchAnnotations = useCallback(async () => {
  //   if (images.length === 0 || !images[active]) return;
    
  //   try {
  //     const res = await api.get(`/api/annotation/${images[active].id}/${folder_id}`);
      
  //     // Check if we have annotations in the response
  //     if (res.data && Object.keys(res.data).length > 0) {
  //       // Create a new data object maintaining label structure but with API text values
  //       const annotationData = {};
        
  //       Object.keys(data).forEach(key => {
  //         annotationData[key] = {
  //           text: res.data[key]?.text || "", // Use API text or empty string
  //           word_ids: res.data[key]?.word_ids || [], // Use API word_ids or empty array
  //           label_name: data[key].label_name // Keep the existing label name
  //         };
  //       });
        
  //       setData(annotationData);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching annotations:", error);
  //     // If there's an error, we can keep the current data state
  //   }
  // }, [active, images, folder_id, data]);


  //GPT working v2
  // const fetchAnnotations = useCallback(async () => {
  //   if (images.length === 0 || !images[active]) return;
  
  //   try {
  //     const res = await api.get(`/api/annotations/${images[active].id}/${folder_id}`);
  
  //     if (res.data && res.data.length > 0) {
  //       const annotationData = {};
  //       res.data.forEach(({ label, word, word_id }) => {
  //         if (!annotationData[label]) {
  //           annotationData[label] = {
  //             text: "",
  //             word_ids: [],
  //             label_name: label,
  //           };
  //         }
  
  //         if (!annotationData[label].word_ids.includes(word_id)) {
  //           annotationData[label].text += `${word} `;
  //           annotationData[label].word_ids.push(word_id);
  //         }
  //       });
  
  //       setData((prevData) => {
  //         const updatedData = { ...prevData };
  //         Object.keys(annotationData).forEach((label) => {
  //           if (updatedData[label]) {
  //             updatedData[label].word_ids = [
  //               ...new Set([...updatedData[label].word_ids, ...annotationData[label].word_ids]),
  //             ];
  //             updatedData[label].text += annotationData[label].text;
  //           } else {
  //             updatedData[label] = annotationData[label];
  //           }
  //         });
  //         return updatedData;
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching annotations:", error);
  //   }
  // }, [active, images, folder_id]);
  const fetchAnnotations = useCallback(async () => {
    if (images.length === 0 || !images[active]) return;
    setLoading(true);
    try {
        const res = await api.get(`/api/annotations/${images[active].id}/${folder_id}`);
        if (res.data && res.data.length > 0) {
            const annotationData = {};
            res.data.forEach(({ label, word, word_id }) => {
                if (!annotationData[label]) {
                    annotationData[label] = {
                        text: "",
                        word_ids: [],
                        label_name: label,
                    };
                }
                if (!annotationData[label].word_ids.includes(word_id)) {
                    // Preserve the entire word content, including escape characters/newlines.
                    annotationData[label].text = word;
                    annotationData[label].word_ids.push(word_id);
                }
            });
            setData(annotationData);
        } else {
            setData({});
        }
    } catch (error) {
        console.error("Error fetching annotations:", error);
    } finally {
        setLoading(false);
    }
}, [active, images, folder_id]);

  // // TODO: Understand useCallback
  // const handleKeyDown = useCallback(
  //   (event) => {
  //     if (event.key === "ArrowLeft") {
  //       onClickPrev();
  //     } else if (event.key === "ArrowRight") {
  //       onClickNext();
  //     } else if (event.key === "Control") {
  //       setCtrlKeyActive(true);
  //     } else if (event.key === "d") {
  //       onClickNext();
  //     } else if (event.key === "a") {
  //       onClickPrev();
  //     } else if (event.key === "q") {
  //       onDropImage();
  //     } else if (event.key === "s") {
  //       saveAnnotation();
  //     }
  //   },
  //   [images, active, arrowButtonDisabled, loading]
  // );

  // const handleKeyUp = useCallback(
  //   (event) => {
  //     if (event.key === "Control") {
  //       setCtrlKeyActive(false);
  //     }
  //   },
  //   [images, active, arrowButtonDisabled, loading]
  // );

  // useEffect(() => {
  //   // when first time load, prevActiveRef.current is  first image
  //   prevActiveRef.current = 0;

  //   (async () => {
  //     let res = await api.get(`/api/folders/${folder_id}`);
  //     setImages(res.data["images"]);
  //     setlabels(res.data["labels"]);

  //     let initial_state = {};
  //     res.data["labels"].forEach((label) => {
  //       initial_state[label.name] = {
  //         text: "",
  //         word_ids: [],
  //         label_name: label.name,
  //       };
  //     });
  //     setInitialState(initial_state);
  //     setData(initial_state);
  //     setActiveInput(res.data["labels"][0]?.id || 0);
  //   })();
  // }, [folder_id]);
  useEffect(() => {
    // When first loading, set prevActiveRef.current to the first image index
    prevActiveRef.current = 0;
  
    (async () => {
      try {
        let res = await api.get(`/api/folders/${folder_id}`);
  
        // Set images
        setImages(res.data.images || []);
  
        // Handle labels (assuming each label has an id)
        let labelsArray = res.data.labels || [];
        
        // Initialize labels state (if labels are not empty)
        setlabels(labelsArray);
        
        // Initialize state for each label (structure should include text and word_ids for annotations)
        let initialState = {};
        labelsArray.forEach((label) => {
          initialState[label.id] = {
            text: "",
            word_ids: [],
            label_name: label.name, // Assuming 'name' is the label name field
          };
        });
        
        console.log("inital state",initialState)
        setInitialState(initialState);
        setData(initialState);
  
        // Set the active input (should be set to a valid label id, assuming label has 'id')
        setActiveInput(labelsArray.length > 0 ? labelsArray[0].id : null);
  
      } catch (error) {
        console.error("Error fetching folder data:", error);
      }
    })();
  }, [folder_id]); // Only re-run if folder_id changes
  
  

  // useEffect(() => {
  //   // // allow to change annotation example by using left and right arrow key
  //   console.log("Adding event listner");
  //   window.addEventListener("keydown", handleKeyDown);
  //   window.addEventListener("keyup", handleKeyUp);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //     window.removeEventListener("keyup", handleKeyUp);
  //   };
  // }, [handleKeyDown, handleKeyUp]);
  // useEffect(() => {
  //   (async () => {
  //     await fetchBbox();
  //   })();
  // }, [images, fetchBbox]);

  useEffect(() => {
    (async function () {
      if (images.length === 0) return;
      // await saveAnnotation();
      let imageName = images[prevActiveRef.current]?.path;
      if (imageName) {
        setKeyValueDatabase({
          ...keyValueDatabase,
          [imageName]: { ...data, bbox: bbox },
        });
      }
      
      let newImage = images[active]?.path;
      // clear old bounding box so that it will not show up when new bounding box is loading in next image
      setBbox([]);

      if (newImage && keyValueDatabase[newImage]) {
        // if the image has been already partially annotated or bounding box is already cached
        setData(keyValueDatabase[newImage]);
        setBbox([...keyValueDatabase[newImage].bbox]);
      } else {
        // Fetch fresh data from API
        await fetchBbox();
        await fetchAnnotations();
      }
      // to access the previous active image in the next activeImage change
      prevActiveRef.current = active;

      // refocus to the first label
      if (Object.keys(data).length > 0) {
        setActiveInput(Object.keys(data)[0]);
        // Add null check before trying to focus
        if (firstLabelInputRef.current) {
          firstLabelInputRef.current.focus();
        }
      }
    })();

    var el = document.querySelector(".thumbnail-active");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [active, fetchAnnotations]);

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

  // const saveAnnotation = async () => {
  //   // save annotation for current image
  //   try {
  //     let labeling = {};
  //     Object.keys(data).forEach((key) => {
  //       labeling[key] = data[key].word_ids;
  //     });
  //     const res = await api.post("/api/annotate/", {
  //       image_id: images[prevActiveRef.current].id,
  //       folder_id: folder_id,
  //       labeling: labeling,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setArrowButtonDisabled(false);
  // };

    const saveAnnotation = async () => {
      try {
          let annotations = [];

          // Transform data into an array of objects matching the GET request format
          Object.keys(data).forEach((label) => {
              data[label].word_ids.forEach((word_id) => {
                  annotations.push({
                      label: label,
                      word: data[label].text, // Preserve full text
                      word_id: word_id,
                  });
              });
          });

          await api.post(`/api/annotate/${images[active].id}/${folder_id}`, annotations);

      } catch (error) {
          console.error("Error saving annotations:", error);
      }
      setArrowButtonDisabled(false);
  };

  const resetAnnotation = () => {
    (async () => {
      await api.delete(`/api/annotations/${folder_id}/${images[active].id}`);
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
                    images[active].name
                  }
                />
              </div>
            ) : (
              <BoundingBox
                img={
                  process.env.REACT_APP_BACKEND_URL +
                  "/api/image/" +
                  images[active].name
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
                            image.name
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

// import { useState, useRef, useCallback } from "react";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import NotInterestedIcon from "@mui/icons-material/NotInterested";
// import api from "../../utils/api";
// import CircularProgress from "@mui/material/CircularProgress";
// import { useEffect } from "react";
// import KeyValue from "./KeyValue";
// import Tooltip from "@mui/material/Tooltip";
// import "./Annotation.css";
// import BoundingBox from "./BoundingBox";
// import ZoomInIcon from "@mui/icons-material/ZoomIn";
// import DeleteIcon from "@mui/icons-material/Delete";
// import RestartAltIcon from "@mui/icons-material/RestartAlt";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import IconButton from "@mui/material/IconButton";
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// // import Button from "@mui/material/Button";
// // import FileDownload from "@mui/icons-material/FileDownload";
// // import exportData from "../../utils/export_json";
// import { useSnackbar } from "notistack";
// // import { FileUploader } from "react-drag-drop-files";
// // import { FileUpload } from "@mui/icons-material";
// import { useNavigate, useParams } from "react-router-dom";
// import Magnifier from "react-magnifier";

// import axios from "axios";

// function Annotation() {
//   //get path parameter
//   let { folder_id } = useParams();

//   const [images, setImages] = useState([]);
//   const [labels, setlabels] = useState([]);
//   const [active, setActive] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [deleteMode, setDeleteMode] = useState(false);
//   const [ctrlKeyActive, setCtrlKeyActive] = useState(false);
//   const firstLabelInputRef = useRef(null);

//   const [bbox, setBbox] = useState([]);

//   const [activeInput, setActiveInput] = useState(0);
//   const [initialState, setInitialState] = useState({});
//   // const [label2word, setLabel2word] = useState({});
//   const [data, setData] = useState(initialState);
//   const [keyValueDatabase, setKeyValueDatabase] = useState({});
//   const navigate = useNavigate();
//   const [magnifyMode, setMagnifyMode] = useState(false);
//   const [arrowButtonDisabled, setArrowButtonDisabled] = useState(false);
//   const prevActiveRef = useRef();
//   const { enqueueSnackbar } = useSnackbar();
//   const add_bbox = (new_bbox) => {
//     let filtered_bbox = bbox.filter(
//       (item) => item.word_id !== new_bbox.word_id
//     );
//     setBbox([...filtered_bbox, new_bbox]);
//   };

//   const fetchBbox = useCallback(async () => {
//     if (images.length === 0) return;
//     setLoading(true);
//     try {
//       const res = await api.get(
//         "/api/bbox/" + images[active].id + "/" + folder_id
//       );
//       setBbox(res.data.words);
//       // setData(res.data.annotation);
//     } catch (error) {
//       console.log(error);
//     }
//     setLoading(false);
//   }, [active, images, folder_id]);

//   // TODO: Understand useCallback
//   const handleKeyDown = useCallback(
//     (event) => {
//       if (event.key === "ArrowLeft") {
//         onClickPrev();
//       } else if (event.key === "ArrowRight") {
//         onClickNext();
//       } else if (event.key === "Control") {
//         setCtrlKeyActive(true);
//       } else if (event.key === "d") {
//         onClickNext();
//       } else if (event.key === "a") {
//         onClickPrev();
//       } else if (event.key === "q") {
//         onDropImage();
//       } else if (event.key === "s") {
//         saveAnnotation();
//       }
//     },
//     [images, active, arrowButtonDisabled, loading]
//   );

//   const handleKeyUp = useCallback(
//     (event) => {
//       if (event.key === "Control") {
//         setCtrlKeyActive(false);
//       }
//     },
//     [images, active, arrowButtonDisabled, loading]
//   );

//   useEffect(() => {
//     // when first time load, prevActiveRef.current is  first image
//     prevActiveRef.current = 0;

//     (async () => {
//       let res = await api.get(`/api/folders/${folder_id}`);
//       setImages(res.data["images"]);
//       setlabels(res.data["labels"]);

//       let initial_state = {};
//       res.data["labels"].forEach((label) => {
//         initial_state[label.name] = {
//           text: "",
//           word_ids: [],
//           label_name: label.name,
//         };
//       });
//       setInitialState(initial_state);
//       setData(initial_state);
//       setActiveInput(res.data["labels"][0].id);
//     })();
//   }, [folder_id]);

//   useEffect(() => {
//     // // allow to change annotation example by using left and right arrow key
//     console.log("Adding event listner");
//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, [handleKeyDown, handleKeyUp]);
//   useEffect(() => {
//     (async () => {
//       await fetchBbox();
//     })();
//   }, [images, fetchBbox]);

//   useEffect(() => {
//     (async function () {
//       if (images.length === 0) return;
//       // await saveAnnotation();
//       let imageName = images[prevActiveRef.current].path;
//       setKeyValueDatabase({
//         ...keyValueDatabase,
//         [imageName]: { ...data, bbox: bbox },
//       });
//       let newImage = images[active].path;
//       // clear old bounding box so that it will not show up when new bounding box is loading in next image
//       setBbox([]);

//       if (keyValueDatabase[newImage]) {
//         // if the image has been already partially annotated or bounding box is already cached
//         setData(keyValueDatabase[newImage]);
//         setBbox([...keyValueDatabase[newImage].bbox]);
//       } else {
//         await fetchBbox();
//       }
//       // to access the previous active image in the next activeImage change
//       prevActiveRef.current = active;

//       // refocus to the first label
//       setActiveInput(Object.keys(data)[0]);
//       firstLabelInputRef.current.focus();
//     })();

//     var el = document.querySelector(".thumbnail-active");
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth", block: "center" });
//     }
//   }, [active]);

//   const onClickBoundingBox = ({ word_id, text }) => {
//     if (deleteMode) {
//       // delete word from teh backend
//       (async () => {
//         try {
//           await api.delete(`/api/delete_word/${word_id}`);
//           let filtered_bbox = bbox.filter((item) => item.word_id !== word_id);
//           setBbox(filtered_bbox);
//         } catch (error) {
//           console.log(error);
//         }
//       })();
//     } else {
//       setArrowButtonDisabled(true);
//       setData({
//         ...data,
//         [activeInput]: {
//           text: data[activeInput].text + " " + text,
//           word_ids: [...data[activeInput].word_ids, word_id],
//           label_name: data[activeInput].label_name,
//         },
//       });
//     }

//     // console.log("data", data);
//   };

//   const saveAnnotation = async () => {
//     // same annotation for current image
//     try {
//       let labeling = {};
//       Object.keys(data).forEach((key) => {
//         labeling[key] = data[key].word_ids;
//       });
//       const res = await api.post("/api/annotate/", {
//         image_id: images[prevActiveRef.current].id,
//         folder_id: folder_id,
//         labeling: labeling,
//       });
//     } catch (error) {
//       console.log(error);
//     }
//     setArrowButtonDisabled(false);
//   };

//   //my code starts here
//   useEffect(() => {
//     const fetchAnnotations = async (image_id, folder_id) => {
//       try {
//         const response = await api.get(`/api/annotations/${image_id}/${folder_id}`);
//         console.log("Annotations fetched HERE!!!:", response.data.annotations);
//       } catch (error) {
//         console.error("Error fetching annotations:", error);
//       }
//     };
  
//     if (folder_id && images.length > 0) {
//       const image_id = images[active]?.id;
//       fetchAnnotations(image_id, folder_id);
//     }
//   }, [folder_id, images, active]);  
//   //my code ends here

//   const resetAnnotation = () => {
//     (async () => {
//       await api.delete(`/api/annotation/${folder_id}/${images[active].id}`);
//       setData(initialState);
//     })();
//   };

//   const onClickNext = () => {
//     if (!arrowButtonDisabled && !loading) {
//       // setArrowButtonDisabled(true);
//       setActive((active + 1) % images.length);
//     } else {
//       enqueueSnackbar("Save the current annotation first", {
//         variant: "warning",
//       });
//     }
//   };

//   const onClickPrev = () => {
//     if (!arrowButtonDisabled && !loading) {
//       // setArrowButtonDisabled(true);
//       setActive((active + images.length - 1) % images.length);
//     } else {
//       enqueueSnackbar("Save the current annotation first", {
//         variant: "warning",
//       });
//     }
//   };

//   const onDropImage = async () => {
//     try {
//       await api.delete(`/api/image/${images[active].id}`);
//       let filtered_images = images.filter((image, index) => index !== active);

//       console.log("Drop image", filtered_images.length, active);

//       if (filtered_images.length === 0) {
//         navigate("/documents");
//       }

//       if (active === filtered_images.length) {
//         setActive(active - 1);
//       }

//       setImages(filtered_images);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <>
//       {images.length === 0 && (
//         <div className="upload-input-container">
//           <CircularProgress color="secondary" />
//         </div>
//       )}
//       {images.length > 0 && (
//         <div className="annotator">
//           <div className="annotator-top-container">
//             <IconButton
//               onClick={onClickPrev}
//               disabled={loading || arrowButtonDisabled}
//               // className="arrow-button arrow-left"
//             >
//               <KeyboardArrowLeftIcon
//                 className={
//                   loading || arrowButtonDisabled
//                     ? "arrow-button arrow-left arrow-disabled"
//                     : "arrow-button arrow-left"
//                 }
//                 fontSize="large"
//               />
//               {/* <ArrowBackIosIcon /> */}
//             </IconButton>

//             {magnifyMode ? (
//               <div className="fullImage">
//                 <Magnifier
//                   src={
//                     process.env.REACT_APP_BACKEND_URL +
//                     "/api/image/" +
//                     images[active].name
//                   }
//                 />
//               </div>
//             ) : (
//               <BoundingBox
//                 img={
//                   process.env.REACT_APP_BACKEND_URL +
//                   "/api/image/" +
//                   images[active].name
//                 }
//                 addBbox={add_bbox}
//                 setBbox={setBbox}
//                 bboxes={bbox}
//                 onClickBoundingBox={onClickBoundingBox}
//                 ocr_loading={loading}
//                 deleteMode={deleteMode}
//                 ctrlKeyActive={ctrlKeyActive}
//                 imageId={images[active].id}
//               />
//             )}

//             <div className="data">
//               {loading ? (
//                 <CircularProgress color="secondary" />
//               ) : (
//                 <KeyValue
//                   setArrowButtonDisabled={setArrowButtonDisabled}
//                   firstLabelInputRef={firstLabelInputRef}
//                   setActiveInput={setActiveInput}
//                   data={data}
//                   setData={setData}
//                 />
//               )}
//             </div>
//             <IconButton
//               onClick={onClickNext}
//               disabled={loading || arrowButtonDisabled}
//             >
//               <KeyboardArrowRightIcon
//                 className={
//                   loading || arrowButtonDisabled
//                     ? "arrow-button arrow-right arrow-disabled"
//                     : "arrow-button arrow-right"
//                 }
//                 fontSize="large"
//               />
//             </IconButton>
//           </div>
//           <div className="bottom-container">
//             <div className="options">
//               <Tooltip title={"Enter delete mode"}>
//                 <DeleteIcon
//                   className="arrow-button arrow-right"
//                   fontSize="large"
//                   style={{ color: deleteMode ? "red" : "black" }}
//                   onClick={() => {
//                     setDeleteMode(!deleteMode);
//                   }}
//                 />
//               </Tooltip>
//               <Tooltip title={"Reset"}>
//                 <RestartAltIcon
//                   className="arrow-button arrow-right"
//                   fontSize="large"
//                   onClick={resetAnnotation}
//                 />
//               </Tooltip>
//               <Tooltip title={"Magnify"}>
//                 <ZoomInIcon
//                   className="arrow-button arrow-right"
//                   fontSize="large"
//                   onClick={() => setMagnifyMode(!magnifyMode)}
//                 />
//               </Tooltip>
//               <Tooltip title={"Discard this image"}>
//                 <NotInterestedIcon
//                   className="arrow-button arrow-right"
//                   fontSize="large"
//                   onClick={onDropImage}
//                 />
//               </Tooltip>
//               <Tooltip title={"Save annotation"}>
//                 <CheckCircleOutlineIcon
//                   className="arrow-button arrow-right"
//                   fontSize="large"
//                   onClick={saveAnnotation}
//                 />
//               </Tooltip>
//             </div>
//             <div className="thumbnail">
//               <div className="thumbnail-inner">
//                 {images.map((image, index) => {
//                   return (
//                     <Tooltip key={index} title={image.path}>
//                       <div
//                         className={`thumbnail-item ${
//                           index === active ? "thumbnail-active" : "inactive"
//                         }`}
//                         onClick={() => {
//                           // setActive(index);
//                           if (!arrowButtonDisabled && !loading) {
//                             // setArrowButtonDisabled(true);
//                             setActive(index);
//                           } else {
//                             enqueueSnackbar(
//                               "Save the current annotation first",
//                               { variant: "warning" }
//                             );
//                           }
//                         }}
//                       >
//                         <img
//                           alt="original"
//                           loading="lazy"
//                           src={
//                             process.env.REACT_APP_BACKEND_URL +
//                             "/api/image/" +
//                             image.name
//                           }
//                         ></img>
//                       </div>
//                     </Tooltip>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Annotation;
