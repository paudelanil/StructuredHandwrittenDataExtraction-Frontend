import { CircularProgress } from "@mui/material";
import { containerClasses } from "@mui/system";
import { useEffect, useState } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "./detailpage.scss";
import ModalImage from "react-modal-image";
import FolderIcon from "@mui/icons-material/Folder";

function TagsDetailPage() {
  const { tagid } = useParams();
  const [images, setImages] = useState([]);
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setImages([]);
    setTag(null);
    async function getImages() {
      setLoading(true);
      try {
        const res = await api.get(`/api/folders/${tagid}`);
        setImages(res.data.images);
        setTag(res.data.tag);
      } catch (error) {
        setError("Error loading images");
        setTimeout(() => {
          setError("");
        }, 5000);
      }
      setLoading(false);
    }
    getImages();
  }, [tagid]);

  // return <ModalImage className="image" small={"https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg"} large={"https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg"} loading=" lazy" alt={"rand"} />
  return (
    <div className="tag-detail-page">
      <div className="page-title">Folders</div>
      <div className="colorline"></div>
      <div className="background-image"></div>

      {error && <div className="error-message">{error}</div>}
      {loading && (
        <div className="loading-container">
          <CircularProgress />
        </div>
      )}
      {tag && (
        <div className="tag-preview">
          <div className="back-button">
            <ArrowBackIcon
              onClick={() => navigate("/tags")}
              sx={{
                fontSize: "2rem",
              }}
            />
          </div>
          <FolderIcon sx={{ color: tag.color, fontSize: "4rem" }} />
          <div className="preview-title">{tag.name}</div>
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="images-container">
          <div className="empty">
            <ImageNotSupportedIcon sx={{ fontSize: "8rem" }} />
            No images found
          </div>
        </div>
      )}
      {!loading && (
        <div className="images-container">
          {images.map((image, i) => {
            const url =
              process.env.REACT_APP_BACKEND_URL + "/api/image/" + image.name;
            return (
              <ModalImage
                className="image"
                small={url}
                large={url}
                loading="lazy"
                alt={image.name}
                hideDownload={true}
                showRotate={true}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TagsDetailPage;
