import * as React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ReactJson from "react-json-view";
import { useTheme } from "@mui/material/styles";
import api from "../utils/api";
import { useDropzone } from "react-dropzone";
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import ReactImageMagnify from "react-image-magnify";
import { useSelector, useDispatch } from "react-redux";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { fetchTags } from "../reducers/tagsSlice";
import { createTag } from "../reducers/tagsSlice";
import FolderIcon from "@mui/icons-material/Folder";

export default function FileUploadPage({ closeModal }) {
  const theme = useTheme();
  const tags = useSelector((state) => state.tags.data);
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [selectedImages, setSelectedImages] = React.useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const onDrop = React.useCallback((acceptedFiles) => {
    console.log("here", acceptedFiles);
    setSelectedImages(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const ItemRenderer = ({ checked, option, onClick, disabled }) => (
    <div
      onClick={onClick}
      className={`item-renderer ${disabled ? "disabled" : ""}`}
    >
      <div
        tabIndex={-1}
        className="tag-preview"
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <FolderIcon sx={{ color: option.color, fontSize: "2rem" }} />
        <div>{option.label}</div>
      </div>
    </div>
  );

  const ValueRenderer = () => {
    return selectedTags.length ? (
      <div style={{ display: "flex", flexDirection: "row" }}>
        {selectedTags.map(({ label, color }) => (
          <div
            className="tag-preview"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FolderIcon sx={{ color: color, fontSize: "2rem" }} />
            {label}
          </div>
        ))}
      </div>
    ) : (
      "Select folder"
    );
  };

  const UploadButtonHandler = async () => {
    if (selectedImages.length === 0) {
      setError("Please select at least one image.");
      return;
    }

    if (selectedTags.length === 0) {
      setError("You must select/create a folder.");
      return;
    }

    setLoading(true);
    try {
      // create a new tag if the user selected a new tag
      let is_new_tag = selectedTags[0].__isNew__;
      let tag_id = null;
      if (is_new_tag) {
        let tag_data = {
          name: selectedTags[0].value.toString(),
          description: "This is a new Folder",
          color:
            "#" +
            ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"),
        };
        let new_tag = await dispatch(createTag(tag_data)).unwrap();
        tag_id = new_tag.id;
        console.log("new_tag", new_tag);
      }

      // set the tag_id to send images to
      if (tag_id === null) {
        tag_id = selectedTags[0].value.toString();
      }

      // loop through the selected images and upload 5 at a time
      for (let i = 0; i < selectedImages.length; i += 5) {
        const form = new FormData();
        for (let j = i; j < i + 5 && j < selectedImages.length; j++) {
          form.append("files", selectedImages[j], selectedImages[j].name);
        }

        form.append("folder_id", tag_id);
        await api.post("/api/upload", form, {
          headers: {
            accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        });
      }
      closeModal();
      dispatch(fetchTags());
    } catch (err) {
      setError("An error occurred while uploading the file(s).");
    }
    setLoading(false);
  };

  return (
    <Box component="main" sx={{ mt: 2, flexGrow: 1, p: 3 }}>
      {error && <div className="upload-error">{error}</div>}
      <Box
        {...getRootProps()}
        component="main"
        sx={{
          mt: 2,
          mb: 2,
          flexGrow: 1,
          p: 3,
          backgroundColor: theme.palette.background.paper,
          border: "3px dashed",
          borderRadius: 3,
        }}
      >
        <input
          hidden
          accept="image/*"
          multiple
          type="file"
          {...getInputProps()}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h5"
            component="h5"
            sx={{ mt: "2rem", color: theme.palette.text.secondary }}
          >
            Drag images into this area to upload them
          </Typography>
          <Button
            sx={{ mt: 4, backgroundColor: theme.palette.button }}
            variant="outlined"
            component="label"
          >
            Upload File
          </Button>
          {selectedImages.length > 0 && (
            <Typography>
              {" "}
              {selectedImages.length} image
              {selectedImages.length === 1 ? "" : "s"} selected for upload.
            </Typography>
          )}
          {/* {selectedImages && (
            <div className="selected-images-container">
              {selectedImages.slice(0, 5).map((file) => (
                <div className="selected-image">
                  <img alt="uploadedimg" src={URL.createObjectURL(file)} />
                </div>
              ))}
              {selectedImages.length - 5 >= 1 && (
                <div className="selected-image">
                  <div>+{selectedImages.length - 5} more</div>
                </div>
              )}
            </div>
          )} */}
        </Box>
      </Box>

      <div className="select-section">
        Add the uploaded images to folder
        <MultiSelect
          hasSelectAll={false}
          className={"select-component"}
          value={selectedTags}
          onChange={(e) => {
            // !Multiselect doesn't support picking only one tag so we have to do this
            // Evaluate what was selected before and what the new
            // selection is and only forward what was just selected
            let justAddedElementArray = e.filter((x) => {
              return !selectedTags.includes(x);
            });
            setSelectedTags(justAddedElementArray);
          }}
          labelledBy={("labelledBy", "Select Folder")}
          options={tags.map((tag) => {
            return { value: tag.id, label: tag.name, color: tag.color };
          })}
          ItemRenderer={ItemRenderer}
          valueRenderer={ValueRenderer}
          isCreatable={true}
        />
        <div className="upload-documents-modal-buttons">
          <button
            className="upload-documents-modal-button"
            onClick={UploadButtonHandler}
          >
            {loading && (
              <CircularProgress size="1.5rem" sx={{ color: "white" }} />
            )}{" "}
            Upload images into Folder
          </button>
        </div>
      </div>
      <Grid container direction="row" spacing={1}></Grid>
    </Box>
  );
}
