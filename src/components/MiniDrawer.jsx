import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet } from "react-router-dom";

import NavBar from "./NavBar";
import Dashboard from "./Dashboard";

export default function MiniDrawer() {
  return (
    <Box>
      <CssBaseline />
      <NavBar />
      <Dashboard />
      <div className="setposition">
        <Outlet />
      </div>
    </Box>
  );
}
