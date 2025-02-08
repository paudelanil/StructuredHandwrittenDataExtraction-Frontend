import { useState } from "react";
import Upload from "./Upload";
import ShowImage from "./ShowImage";
import "./SingleImageWidget.scss";
function SingleImageWidget(props) {
  const [files, setFiles] = useState([]);
  const [fields, setFields] = useState([]); // ["Company", "Address"
  const [error, setError] = useState("");

  const [showExtractPage, setShowExtractPage] = useState(true);

  return (
    <div className="singleImageWidget">
      {showExtractPage && (
        <Upload
          fields={fields}
          setFields={setFields}
          files={files}
          setFiles={setFiles}
          error={error}
          setError={setError}
          setShowExtractPage={setShowExtractPage}
        />
      )}
      {!showExtractPage && (
        <ShowImage
          fields={fields}
          setFields={setFields}
          files={files}
          setFiles={setFiles}
          error={error}
          setError={setError}
          setShowExtractPage={setShowExtractPage}
        />
      )}
    </div>
  );
}

export default SingleImageWidget;
