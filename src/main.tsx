import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App.tsx";
import "./index.css";
import { MapProvider } from "react-map-gl";
import { GeoMetContextProvider } from "./contexts/geometContext.tsx";
import { AnimationContextProvider } from "./contexts/animationContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MapProvider>
        <GeoMetContextProvider>
          <AnimationContextProvider>
            <App />
          </AnimationContextProvider>
        </GeoMetContextProvider>
        {/* <ReactQueryDevtools /> */}
      </MapProvider>
    </QueryClientProvider>
  </StrictMode>,
);
