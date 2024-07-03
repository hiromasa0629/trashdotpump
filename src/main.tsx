import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider, extendTheme, ThemeOverride } from "@chakra-ui/react";
import "./index.css";

const theme = extendTheme({
  sizes: {
    container: {
      root: "85rem",
    },
  },
  colors: {
    indigo: "#4B0082",
    indigo2: "#723AA0",
    indigo3: "#9973BE",
    indigo4: "#C0ADDC",
    indigo5: "#E6E6FA",
  },
} as ThemeOverride);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
