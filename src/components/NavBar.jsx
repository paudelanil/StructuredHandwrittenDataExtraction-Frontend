import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import DevicesIcon from "@mui/icons-material/Devices";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import LogoImage from "../assets/logo.svg";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import profileSkeleton from "../assets/profile.webp";
import Avatar from "@mui/material/Avatar";

import "./index.css";
import "./navbar.scss";

const NavBar = () => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav>
      <div className="topbar">
        <div className="logo-section">
          {/* Logo is clickable and navigates to the home page */}
          <div className="logo-title" onClick={() => navigate("/")}>
            Structured Text Extraction
          </div>
        </div>
        <div className="navbar-right">
          <Typography
            variant="subtitle1"
            component="div"
            style={{ marginRight: "1rem" }}
          >
            Welcome
          </Typography>
          <Avatar
            className="nav-profile-image"
            alt="Profile"
            src={profileSkeleton} // Use a default profile image or placeholder here
            onClick={handleClick}
          />

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            elevation={0}
            sx={{
              boxShadow: "5px 5px 10px 3px rgba(0,0,255,0.75)",
              color: "white",
            }}
          >
            {/* Settings MenuItem */}
            <MenuItem
              onClick={() => {
                navigate("/profile");  // Navigate to profile page
                handleClose();
              }}
            >
              <SettingsIcon sx={{ marginRight: "0.2rem" }} />
              Settings
            </MenuItem>
            {/* Logout MenuItem (You can implement the logout logic if needed) */}
            <MenuItem
              onClick={() => {
                // Implement logout logic here if needed
                handleClose();
              }}
            >
              <LogoutIcon sx={{ marginRight: "0.2rem" }} />
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
