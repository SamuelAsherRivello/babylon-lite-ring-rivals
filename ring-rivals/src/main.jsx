import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RingRivalsGame } from "./content/ring-rivals/Game.jsx";
import { App } from "./ui/App.jsx";
import "./ui/style.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App content={<RingRivalsGame />} />
  </StrictMode>,
);
