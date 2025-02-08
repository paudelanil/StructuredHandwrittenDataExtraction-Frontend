import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import api from "../../../utils/api";
import "./ShowImage.scss";
import Magnifier from "react-magnifier";
import CloseIcon from "@mui/icons-material/Close";

function ShowImage({ files, setFiles, fields, setFields, setShowExtractPage }) {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState({}); // { "Company": "Google", "Address": "1600 Amphitheatre Parkway, Mountain View, CA 94043" }
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      let formdata = new FormData();
      formdata.append("file", files[0]);
      formdata.append("required_labels", fields);
      let response = await api.post("/api/demo", formdata);
      setExtractedInfo(response.data.data);
      setIsLoading(false);
    })();
  }, [files]);
  return (
    <div className="show-image-component">
      <div className="d-flex">
        <div className="keepcenter">
          <div className="show-image-image">
            <Magnifier className="" src={URL.createObjectURL(files[0])} />
            <CloseIcon
              onClick={() => {
                console.log("CLICK");
                setShowExtractPage(true);
                setFiles([]);
                setFields([]);
              }}
              className="cross-icon"
            />
          </div>
        </div>
        <div className="details">
          <div className="details-title">Details</div>
          {fields.length === 0 && (
            <div className="details-content">Nothing to extract</div>
          )}
          {isLoading ? <CircularProgress /> : null}
          {!isLoading &&
            Object.keys(extractedInfo).map((field) => {
              return (
                <div className="details-content">
                  <div className="details-content-title">{field}</div>
                  <div className="details-content-value">
                    {extractedInfo[field]}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default ShowImage;
