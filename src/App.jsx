import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import * as muiColor from "@mui/material/colors";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { SnackbarProvider } from "notistack";

import TagsPage from "./components/TagsPage";
import TagsDetailPage from "./components/TagsPage/detailPage";
import MiniDrawer from "./components/MiniDrawer";
import HomePage from "./components/HomePage";
import TasksPage from "./components/TasksPage";
import Anotator from "./components/Annotation";



const ColorModeContext = React.createContext({ toggleColorMode: () => {} });
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#6F34CB",
          },
          divider: muiColor.grey[400],
          background: {
            default: muiColor.grey[100],
            paper: muiColor.grey[200],
          },
          text: {
            primary: "#333",
            secondary: "#555",
          },
        }
      : {
          primary: {
            main: "#121212",
          },
          divider: "#335",
          background: {
            default: "#556",
            paper: "#334",
          },
          text: {
            primary: "#eef",
            secondary: "#ccd",
          },
        }),
  },
  typography: {
    fontFamily: ["Noto Sans", "Roboto", "Arial", "sans-serif"].join(","),
  },
});

function App() {
  const [mode, setMode] = React.useState("light");
  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <Provider store={store}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={2000}
            preventDuplicate
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
          <Router>
            <Routes>
              {/* MiniDrawer as the main layout */}
              <Route path="/" element={<MiniDrawer context={ColorModeContext} />}>
                <Route index element={<HomePage />} /> {/* Default route for "/" */}
                <Route path="tags" element={<TagsPage />} />
                <Route path="tags/:tagid" element={<TagsDetailPage />} />
                <Route path="tasks" element={<TasksPage />}></Route>
                {/* <Route path='documnts' element={<TasksPage />} ></Route> */}
                <Route
                      path="annotate/:folder_id"
                      element={<Anotator />}
                ></Route>

              </Route>
            </Routes>
          </Router>

          </SnackbarProvider>
          </ThemeProvider>
        </ColorModeContext.Provider>
    </Provider>
  );
}

export default App;
