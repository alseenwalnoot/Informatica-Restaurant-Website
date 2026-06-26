import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import './App.css';
import DesktopView from "./Desktop";
import MobileView from "./Mobile";
import TrackView from "./components/TrackView";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useBreakpointValue } from "@chakra-ui/react"

function AppView() {
  const isMobile = useBreakpointValue({ base: true, md: false })
  return isMobile ? <MobileView /> : <DesktopView />
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppView />} />
          <Route path="/track/:postcode/:orderId" element={<TrackView />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);