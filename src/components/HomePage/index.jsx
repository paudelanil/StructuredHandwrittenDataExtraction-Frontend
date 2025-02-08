import { useState } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "react-responsive-modal";
import { CircularProgress } from "@mui/material";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { TwitterPicker } from "react-color";
import CollectionsIcon from "@mui/icons-material/Collections";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import "./homepage.scss";
import { MultiSelect } from "react-multi-select-component";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as FlowchartSVG } from "../../assets/flowchart.svg";
import { useNavigate } from "react-router-dom";
import SingleImageWidget from "./components/SingleImageWidget";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage-component">
      <div className="page-title">Quick Demo Page</div>
      <div className="colorline"></div>
      {/* <div className="background-image"></div> */}

      <SingleImageWidget />

      {/* <div className="flowchart-container">
        <div className="links">
          <div className="links-title">Quick links</div>
          <div className="link">
            <div className="link-icon" onClick={() => navigate("/tags")}>
              Folders
            </div>
          </div>
          <div className="link">
            <div className="link-icon" onClick={() => navigate("/documents")}>
              Annotate
            </div>
          </div>
          <div className="link">
            <div className="link-icon" onClick={() => navigate("/train")}>
              Train
            </div>
          </div>
          <div className="link">
            <div className="link-icon" onClick={() => navigate("/review")}>
              Review
            </div>
          </div>
        </div>
        <div className="svg-container">
          <FlowchartSVG className="flowchart-svg" />
        </div>
      </div> */}
    </div>
  );
}

export default HomePage;
