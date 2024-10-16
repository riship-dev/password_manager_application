import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

const ROOT = ReactDOM.createRoot(document.getElementById("root"));
ROOT.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);