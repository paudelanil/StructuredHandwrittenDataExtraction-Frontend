import * as React from "react";
import Box from "@mui/material/Box";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import ImageIcon from "@mui/icons-material/Image";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import TableChartIcon from "@mui/icons-material/TableChart";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import "./keyvalue.scss";

export default function BasicTextFields({
  data,
  setActiveInput,
  setData,
  setArrowButtonDisabled,
  firstLabelInputRef,
}) {
  // Function to download text for a specific label
  const downloadLabelText = (label) => {
    const labelData = data[label];
    let blob, filename;

    if (labelData.label_name === "Text") {
      // Download as .txt
      blob = new Blob([labelData.text], { type: 'text/plain' });
      filename = `${labelData.label_name}_annotation.txt`;
    } else if (labelData.label_name === "Table") {
      // Download as .csv
      blob = new Blob([labelData.text], { type: 'text/csv' });
      filename = `${labelData.label_name}_annotation.csv`;
    } else if (labelData.label_name === "Image") {
      // For image, we assume the text contains a base64 or URL
      console.warn("Image download needs additional implementation");
      return;
    } else {
      // Handle other label names or unknown cases
      console.error("Unsupported label type for download.");
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Function to determine field type icon
  const getFieldTypeIcon = (labelName) => {
    switch (labelName) {
      case 'Image':
        return <ImageIcon color="primary" />;
      case 'Table':
        return <TableChartIcon color="primary" />;
      case 'Text':
      default:
        return <TextFieldsIcon color="primary" />;
    }
  };

  // Function to determine if text should be shown as table
  const shouldShowAsTable = (labelName) => {
    return labelName === "Table";
  };

  // Function to parse CSV text to array
  const parseTableText = (text) => {
    if (!text) return [[""]];
    return text.split("\n").map(line => line.split(",").map(cell => cell.trim()));
  };

  // Function to convert array back to CSV text
  const convertTableToText = (tableData) => {
    return tableData.map(row => row.join(",")).join("\n");
  };

  // Table editing functions
  const EditableTable = ({ labelKey, labelData }) => {
    const [tableData, setTableData] = React.useState(parseTableText(labelData.text));
    const [editingCell, setEditingCell] = React.useState(null);
    const [editValue, setEditValue] = React.useState("");
    const inputRef = React.useRef(null);

    // Update the parent data when table changes
    React.useEffect(() => {
      const newText = convertTableToText(tableData);
      if (newText !== labelData.text) {
        setData({
          ...data,
          [labelKey]: {
            ...data[labelKey],
            text: newText,
          },
        });
      }
    }, [tableData]);

    // Focus input when editing starts
    React.useEffect(() => {
      if (editingCell && inputRef.current) {
        inputRef.current.focus();
      }
    }, [editingCell]);

    const startEditing = (rowIndex, colIndex, value) => {
      setEditingCell({ row: rowIndex, col: colIndex });
      setEditValue(value);
    };

    const finishEditing = () => {
      if (editingCell) {
        const newTableData = [...tableData];
        newTableData[editingCell.row][editingCell.col] = editValue;
        setTableData(newTableData);
        setEditingCell(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        finishEditing();
      } else if (e.key === 'Escape') {
        setEditingCell(null);
      }
    };

    const addRow = () => {
      const newRow = Array(tableData[0].length).fill("");
      setTableData([...tableData, newRow]);
    };

    const deleteRow = () => {
      if (tableData.length > 1) {
        const newTableData = tableData.slice(0, -1);
        setTableData(newTableData);
      }
    };

    const addColumn = () => {
      const newTableData = tableData.map(row => [...row, ""]);
      setTableData(newTableData);
    };

    const deleteColumn = () => {
      if (tableData[0].length > 1) {
        const newTableData = tableData.map(row => row.slice(0, -1));
        setTableData(newTableData);
      }
    };

    return (
      <div className="editable-table-container">
        <div className="table-controls" style={{ 
          marginBottom: "12px", 
          display: "flex", 
          gap: "8px", 
          justifyContent: "space-between" 
        }}>
          <div className="row-controls">
            <Tooltip title="Add Row">
              <Button 
                size="small" 
                variant="outlined" 
                startIcon={<AddIcon />} 
                onClick={addRow}
              >
                Row
              </Button>
            </Tooltip>
            <Tooltip title="Delete Last Row">
              <span>
                <Button 
                  size="small" 
                  variant="outlined" 
                  startIcon={<RemoveIcon />} 
                  onClick={deleteRow}
                  disabled={tableData.length <= 1}
                  sx={{ ml: 1 }}
                >
                  Row
                </Button>
              </span>
            </Tooltip>
          </div>
          <div className="column-controls">
            <Tooltip title="Add Column">
              <Button 
                size="small" 
                variant="outlined" 
                startIcon={<AddIcon />} 
                onClick={addColumn}
              >
                Column
              </Button>
            </Tooltip>
            <Tooltip title="Delete Last Column">
              <span>
                <Button 
                  size="small" 
                  variant="outlined" 
                  startIcon={<RemoveIcon />} 
                  onClick={deleteColumn}
                  disabled={tableData[0].length <= 1}
                  sx={{ ml: 1 }}
                >
                  Column
                </Button>
              </span>
            </Tooltip>
          </div>
        </div>
        
        <div className="table-wrapper" style={{ 
          width: "100%", 
          overflowX: "auto",
          border: "1px solid #e0e0e0",
          borderRadius: "4px"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td 
                      key={colIndex}
                      style={{ 
                        padding: "6px 10px", 
                        border: "1px solid #e0e0e0",
                        fontSize: "14px",
                        minWidth: "80px",
                        height: "32px",
                        backgroundColor: editingCell && 
                                       editingCell.row === rowIndex && 
                                       editingCell.col === colIndex ? 
                                       "#f5f5f5" : "transparent",
                        cursor: "pointer"
                      }}
                      onClick={() => startEditing(rowIndex, colIndex, cell)}
                    >
                      {editingCell && 
                       editingCell.row === rowIndex && 
                       editingCell.col === colIndex ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={finishEditing}
                          onKeyDown={handleKeyDown}
                          style={{
                            width: "100%",
                            height: "100%",
                            padding: "2px 4px",
                            fontSize: "14px",
                            border: "none",
                            outline: "none",
                            backgroundColor: "transparent"
                          }}
                        />
                      ) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        maxWidth: "800px"
      }}
      noValidate
      autoComplete="off"
    >
      {Object.keys(data).map((key, index) => {
        if (key === "bbox" || data[key].label_name === "O") {
          return null;
        }

        const labelData = data[key];
        const isImage = labelData.label_name === "Image";
        const isTable = shouldShowAsTable(labelData.label_name);

        return (
          <Paper
            elevation={2}
            className={`kv-field kv-field-${labelData.label_name.toLowerCase()}`}
            key={key}
            sx={{
              p: 2,
              borderRadius: "8px",
              position: "relative"
            }}
          >
            <div className="kv-field-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <Typography variant="subtitle1" component="div" sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1,
                fontWeight: "bold"
              }}>
                {getFieldTypeIcon(labelData.label_name)}
                {labelData.label_name}
              </Typography>
              <div className="kv-field-actions" style={{ display: "flex", gap: "4px" }}>
                <Tooltip title="Clear">
                  <IconButton
                    size="small"
                    aria-label="clear text"
                    onClick={() => {
                      setData({
                        ...data,
                        [key]: {
                          text: "",
                          label_name: data[key].label_name,
                          word_ids: [],
                        },
                      });
                    }}
                  >
                    <CancelOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                  <span>
                    <IconButton
                      size="small"
                      aria-label="download text"
                      onClick={() => downloadLabelText(key)}
                      disabled={!labelData.text}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            </div>

            {isImage ? (
              <div className="image-container" style={{ 
                width: "100%", 
                minHeight: "120px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
                padding: "8px"
              }}>
                {labelData.text ? (
                  <img 
                    src={labelData.text.startsWith('data:') ? labelData.text : '/api/placeholder/320/180'} 
                    alt="Content" 
                    style={{ maxWidth: "100%", maxHeight: "300px" }}
                  />
                ) : (
                  <Typography variant="body2" color="textSecondary">No image content</Typography>
                )}
              </div>
            ) : isTable ? (
              <EditableTable labelKey={key} labelData={labelData} />
            ) : (
              <TextareaAutosize
                onClick={() => {
                  setArrowButtonDisabled(true);
                }}
                ref={index === 0 ? firstLabelInputRef : null}
                key={key}
                onFocus={() => setActiveInput(key)}
                value={labelData.text}
                id={key}
                placeholder={`Enter ${labelData.label_name} content here...`}
                minRows={3}
                style={{ 
                  width: "100%", 
                  padding: "12px", 
                  boxSizing: "border-box",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "14px",
                  lineHeight: "1.5"
                }}
                onChange={(e) => {
                  setData({
                    ...data,
                    [key]: {
                      ...data[key],
                      text: e.target.value,
                    },
                  });
                }}
              />
            )}
          </Paper>
        );
      })}
    </Box>
  );
}