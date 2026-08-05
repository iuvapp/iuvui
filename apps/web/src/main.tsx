import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./app";
import { getLocale } from "./paraglide/runtime.js";
import "./styles.css";

document.documentElement.lang = getLocale();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
