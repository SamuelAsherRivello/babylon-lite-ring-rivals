import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Content } from "./content/Content.jsx";
import { RingRivalsGame } from "./content/ring-rivals/Game.jsx";
import { App } from "./ui/App.jsx";
import "./ui/style.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App content={<><Content /><RingRivalsGame /></>} />
  </StrictMode>,
);
