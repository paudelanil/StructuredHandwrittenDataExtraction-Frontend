// import * as React from "react";

// import CreateIcon from "@mui/icons-material/Create";
// // import DeleteIcon from "@mui/icons-material/Create";
// import FileUploadIcon from "@mui/icons-material/FileUpload";
// import ReceiptIcon from "@mui/icons-material/Receipt";
// import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
// import IosShareIcon from "@mui/icons-material/IosShare";
// import BookmarkIcon from "@mui/icons-material/Bookmark";
// import AddIcon from "@mui/icons-material/Add";
// import { Outlet, useNavigate } from "react-router-dom";
// import AssignmentIcon from "@mui/icons-material/Assignment";
// import { useState } from "react";
// import { Modal } from "react-responsive-modal";
// import "react-responsive-modal/styles.css";
// import FileUpload from "@mui/icons-material/FileUpload";
// import FolderIcon from "@mui/icons-material/Folder";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import FileUploadPage from "./FileUploadPage";
// import ModelTrainingIcon from "@mui/icons-material/ModelTraining";

// import api from "../utils/api";
// import { useEffect } from "react";
// import { CircularProgress } from "@mui/material";

// import { useSelector, useDispatch } from "react-redux";
// import { fetchTags, createTag } from "../reducers/tagsSlice";

// import { fetchmodels } from "../reducers/modelsSlice";

// import "./dashboard.scss";
// import "./index.css"



// export default function Dashboard({ open, handleLogout }) {
//   const navigate = useNavigate();

//   const [openUploadModal, setOpenUploadModal] = React.useState(false);
//   const onOpenUploadModal = () => setOpenUploadModal(true);
//   const onCloseUploadModal = () => setOpenUploadModal(false);

//   const tags = useSelector((state) => state.tags.data);
//   const error = useSelector((state) => state.tags.error);
//   const loading = useSelector((state) => state.tags.loading);
//   const dispatch = useDispatch();

//   const models = useSelector((state) => state.models.data);
//   const models_error = useSelector((state) => state.models.error);
//   const models_loading = useSelector((state) => state.models.loading);

//   useEffect(() => {
//     dispatch(fetchTags());
//     dispatch(fetchmodels());
//   }, [dispatch]);

//   return (
//     <div className="leftsidebar">
//       <div className="upload-button" onClick={onOpenUploadModal}>
//         <FileUploadIcon />
//         Upload New Documents
//       </div>
//       <Modal
//         open={openUploadModal}
//         onClose={onCloseUploadModal}
//         center
//         classNames={{
//           overlay: "customOverlay",
//           modal: "uploadModal",
//         }}
//         styles={{
//           modal: { padding: "3rem", textAlign: "center" },
//           overlay: {},
//           modalContainer: {},
//         }}
//       >
//         <div className="upload-documents-modal-inner">
//           <div className="upload-documents-modal-title">
//             Upload your documents here!
//           </div>
//           <div className="upload-documents-modal-subtitle">
//             You can click the button below to select them or drag and drop them
//             here.
//           </div>
//           <FileUploadPage
//             closeModal={() => {
//               setOpenUploadModal(false);
//             }}
//           />
//         </div>
//       </Modal>

//       <div className="leftsidebarupper-menu">
//         <div
//           className={
//             "leftuppermenu-items" +
//             (window.location.href.indexOf("/tags") === -1
//               ? ""
//               : " active-sidebar-menu")
//           }
//           onClick={() => navigate("/tags")}
//         >
//           <FolderIcon sx={{ mr: 0.5 }} />
//           Folders
//         </div>
//         <div
//           className={
//             "leftuppermenu-items" +
//             (window.location.href.indexOf("/documents") === -1
//               ? ""
//               : " active-sidebar-menu")
//           }
//           onClick={() => navigate("/documents")}
//         >
//           <ReceiptIcon sx={{ mr: 0.5 }} />
//           Annotation
//         </div>
//         {/* <div className={"leftuppermenu-items" + (window.location.href.indexOf('/annotate') === -1 ? "" : " active-sidebar-menu")} onClick={() => navigate("/annotate")}><CreateIcon sx={{ "mr": "5px" }} />Annotate</div> */}
//         <div
//           className={
//             "leftuppermenu-items" +
//             (window.location.href.indexOf("/train") === -1
//               ? ""
//               : " active-sidebar-menu")
//           }
//           onClick={() => navigate("/train")}
//         >
//           <ModelTrainingIcon sx={{ mr: 0.5 }} />
//           Train
//         </div>
//         <div
//           className={
//             "leftuppermenu-items" +
//             (window.location.href.indexOf("/tasks") === -1
//               ? ""
//               : " active-sidebar-menu")
//           }
//           onClick={() => navigate("/tasks")}
//         >
//           <AssignmentIcon sx={{ mr: 0.5 }} />
//           Tasks
//         </div>
//         <div
//           className={
//             "leftuppermenu-items" +
//             (window.location.href.indexOf("/review") === -1
//               ? ""
//               : " active-sidebar-menu")
//           }
//           onClick={() => navigate("/review")}
//         >
//           <RemoveRedEyeIcon sx={{ mr: 0.5 }} />
//           Review/Export
//         </div>
//       </div>
//       <div className="leftsidebarlower-menu">
//         <div className="leftsidebarlowertitle">Models</div>
//         <div className="tags">
//           {models_error && <div className="sidebar-tag">{models_error}</div>}
//           {models_loading && (
//             <div className="sidebar-tag">
//               <CircularProgress size={25} />
//             </div>
//           )}
//           {!models_loading &&
//             models.map((model, index) => {
//               return (
//                 <div
//                   className="sidebar-tag"
//                   key={index}
//                   onClick={() => navigate("/train/" + model.id)}
//                 >
//                   <ModelTrainingIcon sx={{ mr: 0.5, color: "#EC5800" }} />
//                   {model.name}
//                 </div>
//               );
//             })}
//           {!models_loading && !models_error && models.length === 0 && (
//             <div className="sidebar-tag">No models found</div>
//           )}

//           <div className="sidebar-tag-addnew">
//             {/* <AddIcon sx={{ m: "5px" }} />
//             Train a new model */}
//           </div>
//         </div>
//       </div>
//       <div className="leftsidebarlower-menu">
//         <div className="leftsidebarlowertitle">Folders</div>
//         <div className="tags">
//           {error && <div className="sidebar-tag">{error}</div>}
//           {loading && (
//             <div className="sidebar-tag">
//               <CircularProgress size={25} />
//             </div>
//           )}
//           {!loading &&
//             tags.map((tag, index) => {
//               return (
//                 <div
//                   className="sidebar-tag"
//                   key={index}
//                   onClick={() => navigate("/tags/" + tag.id)}
//                 >
//                   <FolderIcon sx={{ mr: 0.5, color: tag.color }} />
//                   {tag.name}
//                 </div>
//               );
//             })}
//           {!loading && !error && tags.length === 0 && (
//             <div className="sidebar-tag">No folders found</div>
//           )}
//           <div className="sidebar-tag-addnew">
//             {/* <AddIcon sx={{ "m": "5px" }} />Add new tag */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import * as React from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FolderIcon from "@mui/icons-material/Folder";
import AssignmentIcon from "@mui/icons-material/Assignment";
import IosShareIcon from "@mui/icons-material/IosShare";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import FileUploadPage from "./FileUploadPage";

import { useSelector, useDispatch } from "react-redux";
import { fetchTags } from "../reducers/tagsSlice";

import "./dashboard.scss";
import "./index.css"

export default function Dashboard({ open, handleLogout }) {
  const navigate = useNavigate();

  const [openUploadModal, setOpenUploadModal] = React.useState(false);
  const onOpenUploadModal = () => setOpenUploadModal(true);
  const onCloseUploadModal = () => setOpenUploadModal(false);

  const tags = useSelector((state) => state.tags.data);
  const error = useSelector((state) => state.tags.error);
  const loading = useSelector((state) => state.tags.loading);
  const dispatch = useDispatch();

  const handleExport = () => {
    // Dummy export function
    alert('Export functionality will be implemented soon!');
  };

  React.useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  return (
    <div className="leftsidebar">
      <div className="upload-button" onClick={onOpenUploadModal}>
        <FileUploadIcon />
        Upload New Documents
      </div>
      <Modal
        open={openUploadModal}
        onClose={onCloseUploadModal}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "uploadModal",
        }}
        styles={{
          modal: { padding: "3rem", textAlign: "center" },
          overlay: {},
          modalContainer: {},
        }}
      >
        <div className="upload-documents-modal-inner">
          <div className="upload-documents-modal-title">
            Upload your documents here!
          </div>
          <div className="upload-documents-modal-subtitle">
            You can click the button below to select them or drag and drop them
            here.
          </div>
          <FileUploadPage
            closeModal={() => {
              setOpenUploadModal(false);
            }}
          />
        </div>
      </Modal>

      <div className="leftsidebarupper-menu">
        <div
          className={
            "leftuppermenu-items" +
            (window.location.href.indexOf("/tags") === -1
              ? ""
              : " active-sidebar-menu")
          }
          onClick={() => navigate("/tags")}
        >
          <FolderIcon sx={{ mr: 0.5 }} />
          Folders
        </div>
        <div
          className={
            "leftuppermenu-items" +
            (window.location.href.indexOf("/tasks") === -1
              ? ""
              : " active-sidebar-menu")
          }
          onClick={() => navigate("/tasks")}
        >
          <AssignmentIcon sx={{ mr: 0.5 }} />
          Tasks
        </div>
        <div
          className="leftuppermenu-items"
          onClick={() => navigate("/export")}
        >
          <IosShareIcon sx={{ mr: 0.5 }} />
          Export
        </div>
      </div>
      
      <div className="leftsidebarlower-menu">
        <div className="leftsidebarlowertitle">Folders</div>
        <div className="tags">
          {error && <div className="sidebar-tag">{error}</div>}
          {loading && (
            <div className="sidebar-tag">
              Loading...
            </div>
          )}
          {!loading &&
            tags.map((tag, index) => {
              return (
                <div
                  className="sidebar-tag"
                  key={index}
                  onClick={() => navigate("/tags/" + tag.id)}
                >
                  <FolderIcon sx={{ mr: 0.5, color: tag.color }} />
                  {tag.name}
                </div>
              );
            })}
          {!loading && !error && tags.length === 0 && (
            <div className="sidebar-tag">No folders found</div>
          )}
        </div>
      </div>
    </div>
  );
}