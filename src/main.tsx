import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider, CssBaseline, CircularProgress, Box } from "@mui/material";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import mainTheme from "./themes/mainTheme";

const AdventurePage = lazy(() => import("./pages/AdventurePage"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={mainTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/adventure"
            element={
              <Suspense
                fallback={
                  <Box
                    sx={{
                      height: "100vh",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#030813",
                    }}
                  >
                    <CircularProgress color="secondary" />
                  </Box>
                }
              >
                <AdventurePage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
