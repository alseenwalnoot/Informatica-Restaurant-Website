import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import './App.css';
import DesktopView from "./Desktop";
import MobileView from "./Mobile";
const root = ReactDOM.createRoot(document.getElementById("root"));
import { useBreakpointValue } from "@chakra-ui/react"

function AppView() {
  const isMobile = useBreakpointValue({ base: true, md: false })

  return isMobile ? <MobileView /> : <DesktopView />
}

root.render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <AppView />
    </ChakraProvider>
  </React.StrictMode>
);