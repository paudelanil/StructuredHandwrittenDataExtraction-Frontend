import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CircularProgress, IconButton } from "@mui/material";
import { Assignment, CloudDownload, FilterList } from "@mui/icons-material";
import Modal from "react-responsive-modal";
import api from "../../utils/api";
import { fetchTags } from "../../reducers/tagsSlice";
import "./exportpage.scss";

const TASK_STATUS_IDX_TO_TEXT = ["Running", "Completed", "Failed"];

function ExportPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportModal, setExportModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [exportOptions, setExportOptions] = useState({
    includeOcr: true,
    includeTables: true,
    format: "json"
  });
  const [exportUrl, setExportUrl] = useState("");

  const tags = useSelector((state) => state.tags.data);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/tasks");
      
      // Sort tasks to show completed ones first
      const sortedTasks = [...res.data].sort((a, b) => {
        // Completed tasks (status 2) first
        if (a.status === 2 && b.status !== 2) return -1;
        if (a.status !== 2 && b.status === 2) return 1;
        
        // Then running tasks (status 1)
        if (a.status === 1 && b.status !== 1) return -1;
        if (a.status !== 1 && b.status === 1) return 1;
        
        // Then by completion percentage (descending)
        return b.percentage_complete - a.percentage_complete;
      });
      
      setTasks(sortedTasks);
      setLoading(false);
    } catch (err) {
      setError("Failure fetching tasks.");
      setLoading(false);
    }
  };

  const updateTasks = async () => {
    try {
      const res = await api.get("/api/tasks");
      // Sort tasks to show completed ones first
      const sortedTasks = [...res.data].sort((a, b) => {
        if (a.status === 2 && b.status !== 2) return -1;
        if (a.status !== 2 && b.status === 2) return 1;
        if (a.status === 1 && b.status !== 1) return -1;
        if (a.status !== 1 && b.status === 1) return 1;
        return b.percentage_complete - a.percentage_complete;
      });
      
      setTasks(sortedTasks);
    } catch (err) {
      setError("Error connecting to the remote server.");
    }
  };

  // fetch only once when the component mounts
  useEffect(() => {
    let id = setInterval(updateTasks, 4000);
    fetchTasks();
    return () => clearInterval(id);
  }, []);

  const handleTaskClick = (task) => {
    // Only allow export for completed tasks
    if (task.status === 2) {
      setSelectedTask(task);
      setExportModal(true);
    } else {
      // For non-completed tasks, navigate to annotation view
      navigate(`/annotate/${task.folder_id}`);
    }
  };

  const handleExport = async () => {
    if (!selectedTask) return;
    
    try {
      setExportLoading(true);
      setExportProgress(0);
      
      // Start the export process
      const response = await api.post("/api/export", {
        task_id: selectedTask.id,
        folder_id: selectedTask.folder_id,
        options: exportOptions
      });
      
      // Simulate progress (in a real app, you might poll for progress)
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);
      
      // Poll for export completion
      const checkExportStatus = async () => {
        try {
          const statusResponse = await api.get(`/api/export/status/${response.data.export_id}`);
          
          if (statusResponse.data.status === "completed") {
            clearInterval(progressInterval);
            setExportProgress(100);

            const relativeDownloadUrl = statusResponse.data.download_url;

            // Construct the absolute download URL by prepending the backend's base URL
            const backendBaseUrl = api.defaults.baseURL; // Assuming your 'api' instance has the base URL configured
            const absoluteDownloadUrl = `${backendBaseUrl}${relativeDownloadUrl}`;

            setExportUrl(absoluteDownloadUrl);
            // setExportUrl(statusResponse.data.download_url);
            console.log("Download URL:", absoluteDownloadUrl);
            
            // Download automatically
            const link = document.createElement('a');
            link.href = absoluteDownloadUrl; // Use the absolute URL here
            link.setAttribute('download', `export_${selectedTask.name}.zip`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => {
              setExportLoading(false);
              setExportModal(false);
            }, 1000);
            
            return;
          }
          
          // If not completed, check again after a delay
          setTimeout(checkExportStatus, 1000);
          
        } catch (err) {
          console.error("Error checking export status:", err);
          setError("Export failed. Please try again.");
          setExportLoading(false);
        }
      };
      
      checkExportStatus();
      
    } catch (err) {
      console.error("Export error:", err);
      setError("Failed to start export process");
      setExportLoading(false);
    }
  };

  return (
    <div className="export-component">
      <Modal
        open={exportModal}
        onClose={() => !exportLoading && setExportModal(false)}
        center
        classNames={{ overlay: "exportOverlay", modal: "exportModal" }}
        styles={{ modal: { textAlign: "center", borderRadius: "10px" } }}
      >
        <div className="export-modal-header">
          <div className="export-modal-title">Export Annotations</div>
        </div>

        <div className="task-preview">
          <Assignment sx={{ mr: "0.2rem", color: "#4caadd" }} />
          <div>{selectedTask?.name}</div>
        </div>

        {error && <div className="export-modal-error">{error}</div>}

        <div className="export-modal-body">
          <div className="export-options">
            <div className="export-option">
              <label>
                <input
                  type="checkbox"
                  checked={exportOptions.includeOcr}
                  onChange={(e) => setExportOptions({...exportOptions, includeOcr: e.target.checked})}
                  disabled={exportLoading}
                />
                Include OCR Data
              </label>
            </div>
            
            <div className="export-option">
              <label>
                <input
                  type="checkbox"
                  checked={exportOptions.includeTables}
                  onChange={(e) => setExportOptions({...exportOptions, includeTables: e.target.checked})}
                  disabled={exportLoading}
                />
                Include Table Data
              </label>
            </div>
            
            <div className="export-option format-selector">
              <label>Export Format:</label>
              <select 
                value={exportOptions.format}
                onChange={(e) => setExportOptions({...exportOptions, format: e.target.value})}
                disabled={exportLoading}
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>
          </div>

          {exportLoading && (
            <div className="export-progress">
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
              <div className="progress-text">{exportProgress}% Complete</div>
            </div>
          )}

          <div className="export-modal-footer">
            <button 
              onClick={handleExport} 
              disabled={exportLoading}
              className="export-modal-footer-button"
            >
              {exportLoading ? (
                <CircularProgress size="1.5rem" />
              ) : (
                <>
                  <CloudDownload sx={{ mr: 1 }} />
                  Start Export
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      <div className="page-title">Export Center</div>
      <div className="colorline"></div>
      <div className="background-image"></div>
      {error && <div className="error-message">{error}</div>}

      <div className="page-subtitle">Available Tasks for Export</div>
      <div className="filter-bar">
        <FilterList sx={{ mr: 1 }} />
        <span>Showing completed tasks first</span>
      </div>
      
      <div className="tasks-table">
        {loading && (
          <div className="loading-row">
            <CircularProgress thickness={4} sx={{ m: 0.5, color: "#6c63ff" }} />
          </div>
        )}
        
        {!loading && tasks.length === 0 && (
          <div className="no-tasks">No tasks available for export. Complete tasks to see them here.</div>
        )}
        
        {!loading &&
          tasks.map((task) => {
            return (
              <div
                key={task.id}
                className={`task-row ${task.status === 2 ? 'completed-task' : ''}`}
                onClick={() => handleTaskClick(task)}
              >
                <div className="task-name">
                  <Assignment sx={{ mr: "0.5rem", color: "#4caadd" }} />
                  {task.name}
                </div>
                <div className="task-description">{task.description}</div>
                <div className="task-type">
                  {task.type === 1 && "OCR Task"}
                  {task.type === 2 && "Table Task"}
                  {task.type === 3 && "OCR and Table Task"}
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
                </div>

                {task.status === 2 && (
                  <div className="export-action">
                    <CloudDownload sx={{ color: "#4caadd" }} />
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default ExportPage;