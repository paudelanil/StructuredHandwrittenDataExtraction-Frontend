import { useState } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "react-responsive-modal";
import { CircularProgress } from "@mui/material";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { TwitterPicker } from "react-color";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";

import "./tagspage.scss";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTags,
  createTag,
  updateTag,
  deleteTag,
} from "../../reducers/tagsSlice";

function TagsPage() {
  const [openAddTagModal, setOpenAddTagModal] = useState(false);
  const [openEditTagModal, setEditTagModal] = useState(false);
  const [openDeleteTagModal, setDeleteTagModal] = useState(false);
  const [activeTag, setActiveTag] = useState({});

  const navigate = useNavigate();

  const tags = useSelector((state) => state.tags.data);
  const error = useSelector((state) => state.tags.error);
  const loading = useSelector((state) => state.tags.loading);
  const dispatch = useDispatch();

  const gotoDetailPage = (tag) => {
    navigate("/tags/" + tag.id);
  };

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  return (
    <div className="tag-component">
      <Modal
        open={openAddTagModal}
        onClose={() => setOpenAddTagModal(!openAddTagModal)}
        center
        classNames={{
          overlay: "tagsOverlay",
          modal: "tagsModal",
        }}
        styles={{
          modal: { textAlign: "center", borderRadius: "10px" },
          overlay: {},
          modalContainer: {},
        }}
      >
        <Formik
          initialValues={{
            name: "New Folder",
            description: "Folder Description",
            color: "#00ff00",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = "Folder name is required.";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            dispatch(createTag(values))
              .unwrap()
              .then((result) => {
                dispatch(fetchTags());
              });

            setSubmitting(false);
            setOpenAddTagModal(!openAddTagModal);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="addtag-modal-header">
                <div className="addtag-modal-title">Add a new folder</div>
              </div>
              <div className="tag-preview">
                <FolderIcon sx={{ color: values.color }} />
                <div>{values.name}</div>
              </div>
              <div className="addtag-modal-error">
                {errors.name && touched.name && errors.name}
                {errors.description &&
                  touched.description &&
                  errors.description}
              </div>

              <div className="addtag-modal-body-text">
                <div className="addtag-modal-body-text-title">Folder Name</div>
                <input
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
              </div>

              <div className="addtag-modal-body-text">
                <div className="addtag-modal-body-text-title">Description</div>
                <input
                  type="text"
                  name="description"
                  onChange={(e) => handleChange(e)}
                  onBlur={handleBlur}
                  value={values.description}
                />
              </div>

              <TwitterPicker
                name="color"
                color={values.color}
                onChangeComplete={(e) => setFieldValue("color", e.hex)}
              />

              <div className="addtag-modal-footer">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="addtag-modal-footer-button"
                >
                  Create Folder
                </button>
              </div>
            </form>
          )}
        </Formik>
      </Modal>

      <Modal
        open={openEditTagModal}
        onClose={() => setEditTagModal(!openEditTagModal)}
        center
        classNames={{
          overlay: "tagsOverlay",
          modal: "tagsModal",
        }}
        styles={{
          modal: { textAlign: "center", borderRadius: "10px" },
          overlay: {},
          modalContainer: {},
        }}
      >
        <Formik
          initialValues={{
            name: activeTag.name,
            description: activeTag.description,
            color: activeTag.color,
            id: activeTag.id,
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = "Folder name is required.";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            dispatch(updateTag(values))
              .unwrap()
              .then((result) => {
                dispatch(fetchTags());
              });
            setSubmitting(false);
            setEditTagModal(!openEditTagModal);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="addtag-modal-header">
                <div className="addtag-modal-title">Update Folder</div>
              </div>
              <div className="tag-preview">
                <FolderIcon sx={{ color: values.color, fontSize: "2rem" }} />
                <div>{values.name}</div>
              </div>
              <div className="addtag-modal-error">
                {errors.name && touched.name && errors.name}
                {errors.description &&
                  touched.description &&
                  errors.description}
              </div>

              <div className="addtag-modal-body-text">
                <div className="addtag-modal-body-text-title">Folder Name</div>
                <input
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
              </div>

              <div className="addtag-modal-body-text">
                <div className="addtag-modal-body-text-title">Description</div>
                <input
                  type="text"
                  name="description"
                  onChange={(e) => handleChange(e)}
                  onBlur={handleBlur}
                  value={values.description}
                />
              </div>

              <TwitterPicker
                name="color"
                color={values.cgotoDetailPageolor}
                onChangeComplete={(e) => setFieldValue("color", e.hex)}
              />

              <div className="addtag-modal-footer">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="addtag-modal-footer-button"
                >
                  Update Folder
                </button>
              </div>
            </form>
          )}
        </Formik>
      </Modal>

      <Modal
        open={openDeleteTagModal}
        onClose={() => setDeleteTagModal(!openDeleteTagModal)}
        center
        classNames={{
          overlay: "logoutOverlay",
          modal: "logoutModal",
        }}
        styles={{
          modal: { textAlign: "center", borderRadius: "10px" },
          overlay: {},
          modalContainer: {},
        }}
      >
        <div className="logout-modal-header">
          <DeleteIcon sx={{ fontSize: "4rem", margin: "1rem" }} />
          <div className="logout-modal-title">
            Are you sure you want to delete this folder?
          </div>
        </div>
        <div className="tag-preview">
          <FolderIcon sx={{ color: activeTag.color, fontSize: "4rem" }} />
          <div>{activeTag.name}</div>
        </div>
        <div className="logout-modal-buttons">
          <button
            className="logout-modal-button"
            onClick={() => setDeleteTagModal(!openDeleteTagModal)}
          >
            No, take me back
          </button>
          <button
            className="logout-modal-button"
            onClick={() => {
              dispatch(deleteTag(activeTag.id))
                .unwrap()
                .then((result) => {
                  dispatch(fetchTags());
                });
              setDeleteTagModal(!openDeleteTagModal);
            }}
          >
            Confirm. Delete folder.
          </button>
        </div>
      </Modal>

      <div className="page-title">Folders</div>
      <div className="colorline"></div>
      <div className="background-image"></div>
      {error && <div className="error-message">{error}</div>}
      <div className="page-subtitle">Current Folders</div>
      <div onClick={() => setOpenAddTagModal(true)} className="tag-row-add-new">
        <AddIcon sx={{ m: 1 }} />
        Create Folder
      </div>
      <div className="tags-table">
        {loading && (
          <div className="loading-row">
            <CircularProgress thickness={4} sx={{ m: 0.5, color: "#6c63ff" }} />
          </div>
        )}
        {!loading &&
          tags.map((tag, index) => {
            return (
              <div
                key={index}
                className="tag-row"
                onClick={(e) => {
                  gotoDetailPage(tag);
                }}
              >
                <div className="tag-name">
                  <FolderIcon sx={{ mr: 1, color: tag.color }} />
                  {tag.name}
                </div>
                <div className="tag-description">
                  {tag.num_images} images in this folder
                </div>
                <div className="actions">
                  <IconButton className="delete-button">
                    <DeleteIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTag(tag);
                        setDeleteTagModal(!openDeleteTagModal);
                      }}
                    />
                  </IconButton>
                  <IconButton className="edit-button">
                    <EditIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTag(tag);
                        setEditTagModal(!openEditTagModal);
                      }}
                    />
                  </IconButton>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default TagsPage;
