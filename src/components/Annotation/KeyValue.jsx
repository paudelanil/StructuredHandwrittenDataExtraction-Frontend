import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
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
        // we also save bbox key for optimization along with the labels while storing in keyvaluedatabase (i.e our simple cache), but we don't want to show it
        return (
          !(key === "bbox" || data[key].label_name === "O") && (
            <div className="kv-label" key={key}>
              <TextField
                onClick={() => {
                  setArrowButtonDisabled(true);
                }}
                inputRef={index === 0 ? firstLabelInputRef : null}
                key={key}
                onFocus={() => setActiveInput(key)}
                value={data[key].text}
                id={key}
                label={data[key].label_name}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
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
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          )
        );
      })}
    </Box>
  );
}
