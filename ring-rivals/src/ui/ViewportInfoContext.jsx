import { createContext, useContext } from "react";

export const ViewportInfoContext = createContext({
  scale: 2,
  setScale: () => {},
  renderPreset: "native",
  nativeBackingSize: { width: 0, height: 0 },
  setRenderResolutionInfo: () => {},
  sceneBorderVisible: false,
  processingPaused: false,
});

export function useViewportInfo() {
  return useContext(ViewportInfoContext);
}
