// import * as React from "react";
// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
// import IconButton from "@mui/material/IconButton";
// import InputAdornment from "@mui/material/InputAdornment";
// import "./keyvalue.scss";

// export default function BasicTextFields({
//   data,
//   setActiveInput,
//   setData,
//   setArrowButtonDisabled,
//   firstLabelInputRef,
// }) {
//   return (
//     <Box
//       component="form"
//       sx={{
//         "& > :not(style)": { my: 2, width: "45ch" },
//       }}
//       noValidate
//       autoComplete="off"
//     >
//       {Object.keys(data).map((key, index) => {
//         // we also save bbox key for optimization along with the labels while storing in keyvaluedatabase (i.e our simple cache), but we don't want to show it
//         return (
//           !(key === "bbox" || data[key].label_name === "O") && (
//             <div className="kv-label" key={key}>
//               <TextField
//                 onClick={() => {
//                   setArrowButtonDisabled(true);
//                 }}
//                 inputRef={index === 0 ? firstLabelInputRef : null}
//                 key={key}
//                 onFocus={() => setActiveInput(key)}
//                 value={data[key].text}
//                 id={key}
//                 label={data[key].label_name}
//                 variant="outlined"
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         aria-label="clear text"
//                         edge="end"
//                         onClick={() => {
//                           setData({
//                             ...data,
//                             [key]: {
//                               text: "",
//                               label_name: data[key].label_name,
//                               word_ids: [],
//                             },
//                           });
//                         }}
//                       >
//                         <CancelOutlinedIcon />
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </div>
//           )
//         );
//       })}
//     </Box>
//   );
// }

// import * as React from "react";
// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
// import IconButton from "@mui/material/IconButton";
// import InputAdornment from "@mui/material/InputAdornment";
// import "./keyvalue.scss";

// export default function BasicTextFields({
//   data,
//   setActiveInput,
//   setData,
//   setArrowButtonDisabled,
//   firstLabelInputRef,
// }) {
//   return (
//     <Box
//       component="form"
//       sx={{
//         "& > :not(style)": { my: 2, width: "45ch" },
//       }}
//       noValidate
//       autoComplete="off"
//     >
//       {Object.keys(data).map((key, index) => {
//         if (key === "bbox" || data[key].label_name === "O") {
//           return null; // Skip rendering for bbox and O labels
//         }
//         return (
//           <div className="kv-label" key={key}>
//             <TextField
//               onClick={() => {
//                 setArrowButtonDisabled(true);
//               }}
//               inputRef={index === 0 ? firstLabelInputRef : null}
//               key={key}
//               onFocus={() => setActiveInput(key)}
//               value={data[key].text}
//               id={key}
//               label={data[key].label_name}
//               variant="outlined"
//               onChange={(e) => {
//                 setData({
//                   ...data,
//                   [key]: {
//                     ...data[key],
//                     text: e.target.value,
//                   },
//                 });
//               }}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="clear text"
//                       edge="end"
//                       onClick={() => {
//                         setData({
//                           ...data,
//                           [key]: {
//                             text: "",
//                             label_name: data[key].label_name,
//                             word_ids: [],
//                           },
//                         });
//                       }}
//                     >
//                       <CancelOutlinedIcon />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </div>
//         );
//       })}
//     </Box>
//   );
// }


//Anil's code
// import * as React from "react";
// import Box from "@mui/material/Box";
// import TextareaAutosize from "@mui/material/TextareaAutosize";
// import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
// import IconButton from "@mui/material/IconButton";
// import InputAdornment from "@mui/material/InputAdornment";
// import "./keyvalue.scss";

// export default function BasicTextFields({
//   data,
//   setActiveInput,
//   setData,
//   setArrowButtonDisabled,
//   firstLabelInputRef,
// }) {
//   return (
//     <Box
//       component="form"
//       sx={{
//         "& > :not(style)": { my: 2, width: "45ch" },
//       }}
//       noValidate
//       autoComplete="off"
//     >
//       {Object.keys(data).map((key, index) => {
//         if (key === "bbox" || data[key].label_name === "O") {
//           return null;
//         }
//         return (
//           <div className="kv-label" key={key}>
//             <TextareaAutosize
//               onClick={() => {
//                 setArrowButtonDisabled(true);
//               }}
//               inputRef={index === 0 ? firstLabelInputRef : null}
//               key={key}
//               onFocus={() => setActiveInput(key)}
//               value={data[key].text}
//               id={key}
//               placeholder={data[key].label_name} // Use placeholder for label
//               minRows={3} // Set a minimum number of rows
//               style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} // Basic styling
//               onChange={(e) => {
//                 setData({
//                   ...data,
//                   [key]: {
//                     ...data[key],
//                     text: e.target.value,
//                   },
//                 });
//               }}
//             />
//             <IconButton
//               aria-label="clear text"
//               edge="end"
//               onClick={() => {
//                 setData({
//                   ...data,
//                   [key]: {
//                     text: "",
//                     label_name: data[key].label_name,
//                     word_ids: [],
//                   },
//                 });
//               }}
//             >
//               <CancelOutlinedIcon />
//             </IconButton>
//           </div>
//         );
//       })}
//     </Box>
//   );
// }

import * as React from "react";
import Box from "@mui/material/Box";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
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
    const blob = new Blob([labelData.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${labelData.label_name}_annotation.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { my: 2, width: "45ch" },
      }}
      noValidate
      autoComplete="off"
    >
      {Object.keys(data).map((key, index) => {
        if (key === "bbox" || data[key].label_name === "O") {
          return null;
        }
        return (
          <div className="kv-label" key={key}>
            <TextareaAutosize
              onClick={() => {
                setArrowButtonDisabled(true);
              }}
              inputRef={index === 0 ? firstLabelInputRef : null}
              key={key}
              onFocus={() => setActiveInput(key)}
              value={data[key].text}
              id={key}
              placeholder={data[key].label_name} // Use placeholder for label
              minRows={3} // Set a minimum number of rows
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} // Basic styling
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
            <div className="button-group">
              <IconButton
                aria-label="clear text"
                edge="end"
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
              <IconButton
                aria-label="download text"
                edge="end"
                onClick={() => downloadLabelText(key)}
                disabled={!data[key].text} // Disable if no text
              >
                <DownloadIcon />
              </IconButton>
            </div>
          </div>
        );
      })}
    </Box>
  );
}