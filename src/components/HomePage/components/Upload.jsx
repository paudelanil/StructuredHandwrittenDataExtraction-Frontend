import Dropzone from "react-dropzone";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
function Upload({
  files,
  setFiles,
  fields,
  setFields,
  error,
  setError,
  setShowExtractPage,
  setExtractedInfo,
}) {
  const [possibleFields, setPossibleFields] = useState([]);
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    (async () => {
      try {
        let fields = await api.get("/api/demo_labels");
        setPossibleFields(fields.data);
      } catch (err) {
        console.log(err);
        // setError("Couldn't connect with the backend server!");
      }
    })();
  }, []);

  return (
    <>
      <div className="page-subtitle">Upload a file to get started!</div>
      <div className="error ml-5 mb-2 text-danger">{error}</div>
      <Dropzone
        style={{ width: "50%" }}
        onDrop={(acceptedFiles) => {
          if (acceptedFiles.length > 1) {
            setError("You can upload only one image at a time!");
            setTimeout(() => {
              setError("");
            }, 3000);
            return;
          }
          if (!acceptedFiles[0].type.startsWith("image/")) {
            setError("Only jpeg images are supported!");
            setTimeout(() => {
              setError("");
            }, 3000);
            return;
          }
          setImagePath(URL.createObjectURL(acceptedFiles[0]));
          setFiles(acceptedFiles);
        }}
        noClick={true}
        noKeyboard={true}
      >
        {({ getRootProps, getInputProps, isDragActive, open }) => (
          <section>
            <div {...getRootProps()} className="root-div  ml-5">
              <input {...getInputProps()} />

              {isDragActive ? (
                <p className="drop-title">Drag files into this area!</p>
              ) : (
                <>
                  {files.length == 0 ? (
                    <div className="drop-btn-container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="svg-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                        />
                      </svg>

                      <button className="drop-btn" onClick={open}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="svg-icon-small"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                          />
                        </svg>
                        Upload
                      </button>

                      <p className="p-title">Drag your files here! </p>
                    </div>
                  ) : (
                    <div className="n-files-present">
                      <div className="n-files-present-title">
                        {files.length} file(s) selected
                      </div>
                      <div className="n-files-present-img-container">
                        <img
                          alt="uploaded file"
                          width={80}
                          height={80}
                          src={imagePath}
                          className="n-files-present-img"
                        />
                      </div>
                      <button className="drop-btn" onClick={open}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="svg-icon-small"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                          />
                        </svg>
                        Upload Another
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        )}
      </Dropzone>

      <div className="field-instruction mt-5 ml-5 d-flex justify-content-center">
        Select information to extract from image
      </div>
      <div className="fields-toggles mt-2 ml-5 d-flex justify-content-center ">
        {possibleFields.map((possibleField) => {
          return (
            <Button
              onClick={() => {
                if (fields.indexOf(possibleField) === -1) {
                  setFields([...fields, possibleField]);
                } else {
                  setFields(fields.filter((field) => field !== possibleField));
                }
              }}
              style={
                fields.indexOf(possibleField) === -1
                  ? {
                      borderRadius: 28,
                      backgroundColor: "white",
                      color: "rgb(108,99,255)",
                      border: "1px solid rgb(108,99,255)",
                      padding: "0.4rem",
                    }
                  : {
                      borderRadius: 28,
                      color: "rgb(108,99,255)",
                      backgroundColor: "rgb(200,200,250)",
                      border: "1px solid rgb(108,99,255)",
                      padding: "0.4rem",
                    }
              }
            >
              {possibleField}
            </Button>
          );
        })}
      </div>
      <div className="fields-toggles mt-3 ml-5 d-flex justify-content-center">
        <Button
          onClick={() => {
            if (files.length === 0) {
              setError("Please upload an image!");
              setTimeout(() => {
                setError("");
              }, 3000);
              return;
            }

            if (fields.length === 0) {
              setError("Please select fields to extract!");
              setTimeout(() => {
                setError("");
              }, 3000);
              return;
            }

            setShowExtractPage(false);
          }}
          style={{
            fontSize: "1.2rem",
            backgroundColor: "rgb(108,99,255)",
            color: "white",
            border: "1px solid rgb(108,99,255)",
            padding: "0.6rem",
          }}
        >
          Extract
        </Button>
      </div>
    </>
  );
}

export default Upload;
