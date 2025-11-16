import React from "react";
import ReactDOM from "react-dom/client";
import TaskManager from "./TaskManager"; // make sure the path matches
import "./styles.css"; // optional

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<TaskManager />);
