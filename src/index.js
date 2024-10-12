import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { disableContextMenu } from 'disable-context-menu';

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
disableContextMenu();

root.render(
  // <StrictMode>
    <App />
  // </StrictMode>
);
