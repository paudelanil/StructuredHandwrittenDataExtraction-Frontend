import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { CircularProgress, IconButton } from "@mui/material";
import { Assignment, Delete as DeleteIcon, Add as AddIcon, Edit as EditIcon, Task, ErrorSharp } from "@mui/icons-material";
import Modal from "react-responsive-modal";
import { TwitterPicker } from "react-color";
import api from "../../utils/api";
import { fetchTags } from "../../reducers/tagsSlice";
import { fetchImagesets } from "../../reducers/imagesetSlice";
import { fetchmodels } from "../../reducers/modelsSlice";
import "./taskspage.scss";


const TASK_STATUS_IDX_TO_TEXT = ["Running", "Completed", "Failed"];

const handleDeleteTask = async (id) => {
  await api.delete("/api/tasks/" + id);
};

function TasksPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
  const [openDeleteTaskModal, setOpenDeleteTaskModal] = useState(false);
  const [activeTask, setActiveTask] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(false);

  const tags = useSelector((state) => state.tags.data);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/tasks");
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failure fetching tasks.");
      setLoading(false);
    }
  };

  const updateTasks = async () => {
    try {
      const res = await api.get("/api/tasks");
      setTasks(res.data);
    } catch (err) {
      setError("Error connecting to the remote server.");
    }
  };

  // fetch only once when the component mounts
  useEffect(() => {
    // let id = setInterval(updateTasks, 4000);
    fetchTasks();
    // return () => clearInterval(id);
  }, []);

  return (
    <div className="task-component">
      <Modal
        open={openCreateTaskModal}
        onClose={() => setOpenCreateTaskModal(false)}
        center
        classNames={{ overlay: "tasksOverlay", modal: "tasksModal" }}
        styles={{ modal: { textAlign: "center", borderRadius: "10px" } }}
      >
        <Formik
          initialValues={{
            name: "New Task",
            description: "Task description",
            type: "",
            tag: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) errors.name = "Task name is required.";
            if (!values.type) errors.type = "Task type is required.";
            if (!values.tag) errors.tag = "Tag selection is required.";
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setModalLoading(true);
            api
              .post("/api/start_task/", {
                name: values.name,
                description: values.description,
                folder_id: values.tag,
              },
              // {
              //   headers: {
              //             accept: "application/json",
              //             "Content-Type": "multipart/form-data",
              //           },
              // })
            )
              .then(() => {
                setModalLoading(false);
                setSubmitting(false);
                setOpenCreateTaskModal(false);
              })
              .catch(() => {
                setModalError("Error creating task. Maybe the remote server is unresponsive.");
                setSubmitting(false);
                setModalLoading(false);
              });
          }}
        >
          {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <div className="addtask-modal-header">
                <div className="addtask-modal-title">Create a new task</div>
              </div>

              <div className="task-preview">
                <Assignment sx={{ mr: "0.2rem", color: "#4caadd" }} />
                <div>{values.name}</div>
              </div>

              <div className="addtask-modal-error">
                {errors.name && errors.name} {errors.type && errors.type} {errors.tag && errors.tag}
                {modalError && modalError}
              </div>

              <div className="addtask-modal-body-text">
                <div className="addtask-modal-body-text-title">Task Name</div>
                <input name="name" onChange={handleChange} onBlur={handleBlur} value={values.name} />
              </div>

              <div className="addtask-modal-body-text">
                <div className="addtask-modal-body-text-title">Description</div>
                <input type="text" name="description" onChange={handleChange} onBlur={handleBlur} value={values.description} />
              </div>

              <div className="addtask-modal-body-text">
                <div className="addtask-modal-body-text-title">Task Type</div>
                <select name="type" onChange={handleChange} onBlur={handleBlur} value={values.type}>
                  <option value="" disabled>Select Task Type</option>
                  <option value="ocr">OCR</option>
                  {/* <option value="inference">Inference</option> */}
                </select>
              </div>

              <div className="tag-select">
                <div className="addtask-modal-body-text-title">Tag</div>
                <select name="tag" onChange={handleChange} onBlur={handleBlur} value={values.tag}>
                  <option value="" disabled>Select a Tag</option>
                  {tags && tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                  ))}
                </select>
              </div>

              <div className="addtask-modal-footer">
                <button type="submit" disabled={isSubmitting} className="addtask-modal-footer-button">
                  {modalLoading && <CircularProgress size="1.5rem" />}
                  Begin Task
                </button>
              </div>
            </form>
          )}
        </Formik>
      </Modal>

      <Modal
        open={openDeleteTaskModal}
        onClose={() => setOpenDeleteTaskModal(false)}
        center
        classNames={{ overlay: "logoutOverlay", modal: "logoutModal" }}
      >
        <div className="logout-modal-header">
          <DeleteIcon sx={{ fontSize: "2rem", margin: "1rem" }} />
          <div className="logout-modal-title">Are you sure you want to delete this task?</div>
        </div>
        <div className="tag-preview">
          <Assignment sx={{ fontSize: "4rem", color: "#4caadd" }} />
          {activeTask.name}
        </div>
        <div className="logout-modal-buttons">
          <button onClick={() => setOpenDeleteTaskModal(false)}>No, take me back</button>
          <button onClick={() => { handleDeleteTask(activeTask.id); setOpenDeleteTaskModal(false); }}>Confirm. Delete task.</button>
        </div>
      </Modal>

      <div className="page-title">Tasks</div>
      <div className="colorline"></div>
      <div className="background-image"></div>
      {error && <div className="error-message">{error}</div>}

      <div className="page-subtitle">Your Tasks</div>
      <div onClick={() => setOpenCreateTaskModal(true)} className="task-row-add-new">
        <AddIcon sx={{ m: 1 }} />
        Start a new Task
      </div>
      
      <div className="tasks-table">
         {loading && (
          <div className="loading-row">
            <CircularProgress thickness={4} sx={{ m: 0.5, color: "#6c63ff" }} />
          </div>
        )}
        {!loading &&
          tasks.map((task) => {
            return (
              <div
                key={task.id}
                className="task-row"
                onClick={() => {
                  if (task.type === 3) {
                    return;
                  }

                  if (task.type === 1) {
                    navigate(`/annotate/${task.folder_id}`);
                  }
                }}
              >
                {/* TODO:feature to task ma click garyo vane ocr page or review page maa jaana paryo */}

                <div className="task-name">
                  <Assignment sx={{ mr: "0.5rem", color: "#4caadd" }} />
                  {task.name}
                </div>
                <div className="task-description">{task.description}</div>
                <div className="task-type">
                  {task.type === 1 && "OCR Task"}
                  {/* {task.type === 2 && "Inference Task"} */}
                  {/* {task.type === 2 && "Training Task"} */}
                </div>
                <div
                  className={
                    "status status-" +
                    TASK_STATUS_IDX_TO_TEXT[task.status - 1].toLowerCase()
                  }
                >
                  <div className="status-text">
                    {TASK_STATUS_IDX_TO_TEXT[task.status - 1]}:{" "}
                    {Math.round(task.percentage_complete * 100) / 100}%
                  </div>

                  {/* <div className="status-text">
                    {task.percentage_completed}%
                  </div> */}
                </div>

                {/* <div className="actions"> */}
                <IconButton
                  // component="div"
                  className="delete-icon"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTask(task);
                    setOpenDeleteTaskModal(true);
                    // handleDeleteTask(task.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
              // </div>
            );
          })}
      </div>
    </div>
    
  );
}

export default TasksPage;


// import { useState } from "react";
// import ModelTraining from "@mui/icons-material/ModelTraining";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import Modal from "react-responsive-modal";
// import { CircularProgress } from "@mui/material";
// import { Formik, Field, Form, FormikHelpers } from "formik";
// import { TwitterPicker } from "react-color";
// import { useSelector } from "react-redux";
// import "./taskspage.scss";
// import IconButton from "@mui/material/IconButton";
// import api from "../../utils/api";
// import { useEffect } from "react";
// import { Assignment, ErrorSharp, Task } from "@mui/icons-material";
// import { useDispatch } from "react-redux";
// import { fetchImagesets } from "../../reducers/imagesetSlice";
// import { fetchmodels } from "../../reducers/modelsSlice";
// import { Link, useNavigate } from "react-router-dom";

// const TASK_STATUS_IDX_TO_TEXT = ["Running", "Completed", "Failed"];

// const handleDeleteTask = async (id) => {
//   await api.delete("/api/task/" + id);
// };

// function TasksPage() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [tasks, setTasks] = useState([]);

//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/api/tasks");
//       setTasks(res.data);
//       setLoading(false);
//     } catch (err) {
//       setError("Failure fetching tasks.");
//       setLoading(false);
//     }
//   };

//   const updateTasks = async () => {
//     try {
//       const res = await api.get("/api/tasks");
//       setTasks(res.data);
//     } catch (err) {
//       setError("Error connecting the the remote server.");
//     }
//   };

//   useEffect(() => {
//     let id = setInterval(updateTasks, 4000);
//     fetchTasks();
//     return () => {
//       console.log("clearing interval");
//       clearInterval(id);
//     };
//   }, []);

//   const dispatch = useDispatch();
//   const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
//   const imagesets = useSelector((state) => state.imagesets.data);
//   const imagesetsError = useSelector((state) => state.imagesets.error);
//   const models = useSelector((state) => state.models.data);
//   const modelsError = useSelector((state) => state.models.error);

//   const [modalLoading, setModalLoading] = useState(false);
//   const [modalError, setModalError] = useState(false);

//   const [openDeleteTaskModal, setOpenDeleteTaskModal] = useState(false);
//   const [activeTask, setActiveTask] = useState({});

//   const navigate = useNavigate();

//   useEffect(() => {
//     dispatch(fetchImagesets());
//     dispatch(fetchmodels());
//   }, []);

//   return (
//     <div className="task-component">
//       <Modal
//         open={openCreateTaskModal}
//         onClose={() => setOpenCreateTaskModal(!openCreateTaskModal)}
//         center
//         classNames={{
//           overlay: "tasksOverlay",
//           modal: "tasksModal",
//         }}
//         styles={{
//           modal: { textAlign: "center", borderRadius: "10px" },
//           overlay: {},
//           modalContainer: {},
//         }}
//       >
//         <Formik
//           initialValues={{
//             name: "New Task",
//             description: "Task description",
//             type: "",
//             imageset: "",
//             model: "",
//           }}
//           validate={(values) => {
//             const errors = {};
//             if (!values.name) {
//               errors.name = "Task name is required.";
//             }
//             if (!values.type) {
//               errors.type = "Task type is required.";
//             }
//             if (!values.imageset) {
//               errors.imageset = "Image collection is required.";
//             }
//             if (!values.model && values.type === "inference") {
//               errors.model = "Model is required.";
//             } else {
//               delete errors.model;
//             }
//             return errors;
//           }}
//           onSubmit={(values, { setSubmitting }) => {
//             if (values.type === "inference") {
//               setModalLoading(true);
//               api
//                 .post(
//                   "/api/start_review_task/" +
//                     values.imageset +
//                     "/" +
//                     values.model,
//                   {
//                     name: values.name,
//                     description: values.description,
//                     imageset: values.imageset,
//                     model: values.model,
//                   },
//                   {
//                     headers: {
//                       accept: "application/json",
//                       "Content-Type": "multipart/form-data",
//                     },
//                   }
//                 )
//                 .then(() => {
//                   setModalLoading(false);
//                   setSubmitting(false);
//                   setOpenCreateTaskModal(!openCreateTaskModal);
//                 })
//                 .catch((err) => {
//                   setModalError(
//                     "Error creating task. Maybe the remote server is unresponsive."
//                   );

//                   setSubmitting(false);

//                   setModalLoading(false);
//                 });
//             } else if (values.type === "ocr") {
//               setModalLoading(true);

//               api
//                 .post("/api/start_ocr_task/", {
//                   imageset_id: values.imageset,
//                   name: values.name,
//                   description: values.description,
//                 })
//                 .then(() => {
//                   setModalLoading(false);
//                   setSubmitting(false);
//                   setOpenCreateTaskModal(!openCreateTaskModal);
//                 })
//                 .catch((err) => {
//                   setModalError(
//                     "Error creating task. Maybe the remote server is unresponsive."
//                   );

//                   setSubmitting(false);
//                   setModalLoading(false);
//                 });
//             } else {
//               console.log("Invalid task type");
//               return;
//             }
//           }}
//         >
//           {({
//             values,
//             errors,
//             touched,
//             handleChange,
//             handleBlur,
//             handleSubmit,
//             setFieldValue,
//             isSubmitting,
//           }) => (
//             <form onSubmit={handleSubmit}>
//               <div className="addtask-modal-header">
//                 <div className="addtask-modal-title">Create a new task</div>
//               </div>
//               <div className="task-preview">
//                 <Assignment sx={{ mr: "0.2rem", color: "#4caadd" }} />
//                 <div>{values.name}</div>
//               </div>
//               <div className="addtask-modal-error">
//                 {errors.name && touched.name && errors.name}{" "}
//                 {errors.description &&
//                   touched.description &&
//                   errors.description}{" "}
//                 {errors.type && touched.type && errors.type}{" "}
//                 {errors.imageset && touched.imageset && errors.imageset}{" "}
//                 {errors.model && touched.model && errors.model}{" "}
//                 {values.model === "inference" &&
//                   models &&
//                   models.length === 0 && (
//                     <div>
//                       There are no models available. Please create a model
//                       first.
//                     </div>
//                   )}{" "}
//                 {imagesets &&
//                   imagesets.imagesets &&
//                   imagesets.imagesets.length === 0 && (
//                     <div>
//                       There are no image collections available. Please create an
//                       Image Collection first.
//                     </div>
//                   )}{" "}
//                 {modalError && modalError}
//               </div>

//               <div className="addtask-modal-body-text">
//                 <div className="addtask-modal-body-text-title">Task Name</div>
//                 <input
//                   name="name"
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   value={values.name}
//                 />
//               </div>

//               <div className="addtask-modal-body-text">
//                 <div className="addtask-modal-body-text-title">Description</div>
//                 <input
//                   type="text"
//                   name="description"
//                   onChange={(e) => handleChange(e)}
//                   onBlur={handleBlur}
//                   value={values.description}
//                 />
//               </div>

//               <div className="addtask-modal-body-text">
//                 <div className="addtask-modal-body-text-title">Task Type</div>
//                 <select
//                   name="colorss"
//                   value={values.imageSet}
//                   onChange={(e) => {
//                     e.preventDefault();
//                     setFieldValue("type", e.target.value);
//                   }}
//                   onBlur={handleBlur}
//                   style={{ display: "block" }}
//                 >
//                   <option value="" disabled selected>
//                     Select an Task Type
//                   </option>

//                   <option value="ocr">OCR</option>
//                   <option value="inference">Inference</option>
//                 </select>
//               </div>

//               <div className="imageset-select">
//                 <div className="addtag-modal-body-text-title">
//                   Image Collection
//                 </div>
//                 <select
//                   name="imageset"
//                   value={values.imageset}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   style={{ display: "block" }}
//                 >
//                   <option
//                     disabled
//                     selected
//                     value=""
//                     label="Select a Image Collection"
//                   >
//                     Select a Image Collection{" "}
//                   </option>
//                   {imagesets &&
//                     imagesets.imagesets &&
//                     imagesets.imagesets.map((imageset) => {
//                       return (
//                         <option
//                           value={imageset.imageset_id}
//                           label={imageset.name}
//                         >
//                           {imageset.ImageSet.name}
//                         </option>
//                       );
//                     })}
//                 </select>
//               </div>

//               {values.type === "inference" && (
//                 <div className="imageset-select">
//                   <div className="addtask-modal-body-text-title">Model</div>
//                   <select
//                     name="model"
//                     value={values.model}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     style={{ display: "block" }}
//                   >
//                     <option disabled value="" label="Select a Model">
//                       Select a Model{" "}
//                     </option>
//                     {models &&
//                       models.map((model) => {
//                         return <option value={model.id}>{model.name}</option>;
//                       })}
//                   </select>
//                 </div>
//               )}

//               <div className="addtask-modal-footer">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="addtask-modal-footer-button"
//                 >
//                   {modalLoading && <CircularProgress size="1.5rem" />}
//                   Begin Task
//                 </button>
//               </div>
//             </form>
//           )}
//         </Formik>
//       </Modal>

//       <Modal
//         open={openDeleteTaskModal}
//         onClose={() => setOpenDeleteTaskModal(!openDeleteTaskModal)}
//         center
//         classNames={{
//           overlay: "logoutOverlay",
//           modal: "logoutModal",
//         }}
//         styles={{
//           modal: { textAlign: "center", borderRadius: "10px" },
//           overlay: {},
//           modalContainer: {},
//         }}
//       >
//         <div className="logout-modal-header">
//           <DeleteIcon sx={{ fontSize: "2rem", margin: "1rem" }} />
//           <div className="logout-modal-title">
//             Are you sure you want to delete this task?
//           </div>
//         </div>
//         <div className="tag-preview">
//           <Assignment sx={{ fontSize: "4rem", color: "#4caadd" }} />
//           {activeTask.name}
//         </div>
//         <div className="logout-modal-buttons">
//           <button
//             className="logout-modal-button"
//             onClick={() => setOpenDeleteTaskModal(!openDeleteTaskModal)}
//           >
//             No, take me back
//           </button>
//           <button
//             className="logout-modal-button"
//             onClick={() => {
//               handleDeleteTask(activeTask.id);
//               setOpenDeleteTaskModal(!openDeleteTaskModal);
//             }}
//           >
//             Confirm. Delete task.
//           </button>
//         </div>
//       </Modal>

//       <div className="page-title">Tasks</div>
//       <div className="colorline"></div>
//       <div className="background-image"></div>
//       {error && <div className="error-message">{error}</div>}

//       <div className="page-subtitle">Your Tasks</div>
//       <div
//         onClick={() => {
//           setOpenCreateTaskModal(!openCreateTaskModal);
//         }}
//         className="task-row-add-new"
//       >
//         <AddIcon sx={{ m: 1 }} />
//         Start a new Task
//       </div>
//       <div className="tasks-table">
//         {loading && (
//           <div className="loading-row">
//             <CircularProgress thickness={4} sx={{ m: 0.5, color: "#6c63ff" }} />
//           </div>
//         )}
//         {!loading &&
//           tasks.map((task) => {
//             return (
//               <div
//                 key={task.id}
//                 className="task-row"
//                 onClick={() => {
//                   if (task.type === 3) {
//                     return;
//                   }

//                   navigate(
//                     task.type === 1
//                       ? `/annotate/${task.imageset_id}`
//                       : `/review/${task.model_id}/${task.imageset_id}`
//                   );
//                 }}
//               >
//                 {/* TODO:feature to task ma click garyo vane ocr page or review page maa jaana paryo */}

//                 <div className="task-name">
//                   <Assignment sx={{ mr: "0.5rem", color: "#4caadd" }} />
//                   {task.name}
//                 </div>
//                 <div className="task-description">{task.description}</div>
//                 <div className="task-type">
//                   {task.type === 1 && "OCR Task"}
//                   {task.type === 2 && "Inference Task"}
//                   {task.type === 3 && "Training Task"}
//                 </div>
//                 <div
//                   className={
//                     "status status-" +
//                     TASK_STATUS_IDX_TO_TEXT[task.status - 1].toLowerCase()
//                   }
//                 >
//                   <div className="status-text">
//                     {TASK_STATUS_IDX_TO_TEXT[task.status - 1]}:{" "}
//                     {Math.round(task.percentage_complete * 100) / 100}%
//                   </div>

//                   {/* <div className="status-text">
//                     {task.percentage_completed}%
//                   </div> */}
//                 </div>

//                 {/* <div className="actions"> */}
//                 <IconButton
//                   // component="div"
//                   className="delete-icon"
//                   aria-label="delete"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setActiveTask(task);
//                     setOpenDeleteTaskModal(true);
//                     // handleDeleteTask(task.id);
//                   }}
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </div>
//               // </div>
//             );
//           })}
//       </div>
//     </div>
//   );
// }

// export default TasksPage;
