import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { MapProvider } from "react-map-gl";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MapProvider>
      <App />
    </MapProvider>
  </StrictMode>
);

