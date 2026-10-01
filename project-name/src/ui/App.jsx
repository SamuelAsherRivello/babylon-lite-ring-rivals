import { useCallback, useEffect, useState } from "react";
import versionText from "../../../version.txt?raw";
import { BrowserSurface } from "./BrowserSurface.jsx";
import { aspectRatioPresets, defaultLayout } from "./layout.js";
import { Dialog } from "./Dialog.jsx";
import { getRenderScaleDisplayText } from "../content/babylon/showcase-overlay.js";
import babylonLogoUrl from "../content/babylon/images/babylon_logo_32x32.png?url";
import {
  cycleRenderResolutionPreset,
  getRenderResolutionDimensions,
  isRenderResolutionPreset,
} from "../content/babylon/render-resolution.js";
import { ViewportInfoContext } from "./ViewportInfoContext.jsx";

const configStorageKey = "github-repository-template.config";
const fullscreenStorageKey = "github-repository-template.fullscreen";
const defaultConfig = Object.freeze({ fullscreen: false, orientation: null, hudVisible: true, renderPreset: "native" });
const repositoryUrl = "https://github.com/SamuelAsherRivello/github-repository-template";

function readConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(configStorageKey) ?? "null");
    return {
      fullscreen: typeof saved?.fullscreen === "boolean"
        ? saved.fullscreen
        : localStorage.getItem(fullscreenStorageKey) === "true",
      orientation: saved?.orientation === "portrait" || saved?.orientation === "landscape" ? saved.orientation : defaultConfig.orientation,
      hudVisible: typeof saved?.hudVisible === "boolean" ? saved.hudVisible : defaultConfig.hudVisible,
      renderPreset: isRenderResolutionPreset(saved?.renderPreset) ? saved.renderPreset : defaultConfig.renderPreset,
    };
  } catch {
    return defaultConfig;
  }
}

export function Corner({ position, children }) {
  return <div className={`corner corner_${position}`}>{children}</div>;
}

function GitHubMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.4 0-.2-.01-.86-.01-1.56-2.01.38-2.53-.5-2.69-.96-.09-.24-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.91-3.64-4.04 0-.89.31-1.62.82-2.19-.08-.2-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.82c.68 0 1.36.09 2 .28 1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.96.08 2.16.51.57.82 1.29.82 2.19 0 3.14-1.87 3.83-3.65 4.04.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .22.15.48.55.4A8.02 8.02 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z" />
    </svg>
  );
}

export function App({ layout = defaultLayout, content = null, gutters = {} }) {
  const [config, setConfig] = useState(readConfig);
  const { orientation: orientationOverride, hudVisible, renderPreset } = config;
  const setOrientationOverride = (orientation) => setConfig((current) => ({ ...current, orientation }));
  const setHudVisible = (hudVisible) => setConfig((current) => ({ ...current, hudVisible }));
  const landscape = (orientationOverride ?? layout.orientation) === "landscape";
  const portrait = !landscape;
  const activeLayout = orientationOverride === null ? layout : {
    ...layout,
    orientation: orientationOverride,
    ...aspectRatioPresets[orientationOverride],
  };
  const fullscreenPreferred = config.fullscreen;
  const [viewportPixels, setViewportPixels] = useState({ width: 0, height: 0 });
  const [windowPixels, setWindowPixels] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [devicePixelRatio, setDevicePixelRatio] = useState(window.devicePixelRatio);
  const [activeDialog, setActiveDialog] = useState(null);
  const [renderScale, setRenderScale] = useState(1);
  const [reportedRenderResolution, setReportedRenderResolution] = useState(null);
  const nativeBackingSize = {
    width: Math.floor(viewportPixels.width * devicePixelRatio),
    height: Math.floor(viewportPixels.height * devicePixelRatio),
  };
  const estimatedRenderResolution = getRenderResolutionDimensions(
    nativeBackingSize.width,
    nativeBackingSize.height,
    renderPreset,
  );
  const renderResolutionInfo = reportedRenderResolution
    && reportedRenderResolution.preset === renderPreset
    && reportedRenderResolution.nativeWidth === nativeBackingSize.width
    && reportedRenderResolution.nativeHeight === nativeBackingSize.height
    ? reportedRenderResolution
    : estimatedRenderResolution;
  const renderResolutionText = renderResolutionInfo.width > 0
    ? `(R) RenderResolution: ${renderResolutionInfo.width}x${renderResolutionInfo.height}${renderPreset === "native" ? " (Native)" : ""}`
    : "(R) RenderResolution: measuring…";
  const updateViewportPixels = useCallback((rect) => {
    setViewportPixels((current) => {
      const next = { width: Math.round(rect.width), height: Math.round(rect.height) };
      return current.width === next.width && current.height === next.height ? current : next;
    });
  }, []);

  const versionNumber = versionText.trim().replace(/^version=/, "").replace(/^v/, "");

  useEffect(() => {
    const updateWindowPixels = () => {
      setWindowPixels({ width: window.innerWidth, height: window.innerHeight });
      setDevicePixelRatio(window.devicePixelRatio);
    };
    window.addEventListener("resize", updateWindowPixels);
    return () => window.removeEventListener("resize", updateWindowPixels);
  }, []);

  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      const key = event.key.toLowerCase();
      if (key === "f") toggleFullscreen();
      if (key === "p") setConfig((current) => ({ ...current, orientation: current.orientation === "portrait" ? "landscape" : "portrait" }));
      if (key === "h") setConfig((current) => ({ ...current, hudVisible: !current.hudVisible }));
      if (key === "t") resetLocalStorage();
      if (key === "c") setActiveDialog((dialog) => dialog === "config" ? null : "config");
      if (key === "v") setActiveDialog((dialog) => dialog === "stats" ? null : "stats");
      if (key === "b") setActiveDialog((dialog) => dialog === "babylon" ? null : "babylon");
      if (key === "r" && !event.repeat) setConfig((current) => ({
        ...current,
        renderPreset: cycleRenderResolutionPreset(current.renderPreset),
      }));
      if (event.key === "Escape") setActiveDialog(null);
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  });

  useEffect(() => {
    try {
      localStorage.setItem(configStorageKey, JSON.stringify(config));
      localStorage.setItem(fullscreenStorageKey, config.fullscreen ? "true" : "false");
    } catch {
      // Keep the in-memory React settings usable when browser storage is unavailable.
    }
  }, [config]);

  useEffect(() => {
    const syncFullscreenState = () => {
      setConfig((current) => ({ ...current, fullscreen: Boolean(document.fullscreenElement) }));
    };

    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () => document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, [config.fullscreen]);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        if (!document.fullscreenElement) {
          setConfig((current) => ({ ...current, fullscreen: true }));
        }
      }
    } catch {
      setConfig((current) => ({ ...current, fullscreen: false }));
    }
  };

  const resetLocalStorage = () => {
    try {
      localStorage.clear();
    } catch {
      // The React settings can still reset if browser storage is unavailable.
    }
    window.location.reload();
  };

  return (
    <ViewportInfoContext.Provider value={{
      scale: renderScale,
      setScale: setRenderScale,
      renderPreset,
      nativeBackingSize,
      setRenderResolutionInfo: setReportedRenderResolution,
      sceneBorderVisible: activeDialog === "babylon",
      processingPaused: activeDialog !== null,
    }}>
    <BrowserSurface layout={activeLayout} gutters={gutters} onViewportResize={updateViewportPixels} ui={<>
      {hudVisible && <div className="babylon_viewport_info" aria-label="Babylon Lite viewport settings">
        <img className="babylon_viewport_logo" src={babylonLogoUrl} alt="" aria-hidden="true" />
        <div className="corner-title"><button className="babylon_viewport_info_button" type="button" onClick={() => setActiveDialog("babylon")} aria-label="Open Babylon Lite settings">(B)</button> Babylon Lite</div>
        <div className="corner-body"><button className="babylon_viewport_info_button" type="button" onClick={() => setConfig((current) => ({ ...current, renderPreset: cycleRenderResolutionPreset(current.renderPreset) }))} aria-label={`Cycle render resolution, currently ${renderResolutionInfo.width} by ${renderResolutionInfo.height}`}>{renderResolutionText}</button></div>
        <div className="corner-body">{getRenderScaleDisplayText(renderScale)}</div>
        <div className="corner-body">Mode: 2DPixelPerfect</div>
      </div>}
      {hudVisible && <Corner position="top_left">
        <div id="project_title" className="corner-body">
          GitHub Repository Template
        </div>
      </Corner>}
      {hudVisible && <Corner position="top_right">
        <a className="corner-body" href={repositoryUrl} target="_blank" rel="noopener noreferrer" aria-label="View the repository on GitHub" tabIndex={-1}>
          <GitHubMark />
        </a>
      </Corner>}
      {hudVisible && <Corner position="bottom_left">
        <section id="config" aria-labelledby="config_title">
          <div id="config_title" className="corner-title">(C) Config</div>
          {hudVisible && <label className="corner-body corner_option"><span>(F) Fullscreen</span><input id="fullscreen_toggle" type="checkbox" checked={fullscreenPreferred} onChange={toggleFullscreen} /></label>}
          {hudVisible && <label className="corner-body corner_option"><span>(P) Portrait</span><input id="portrait_checkbox" type="checkbox" checked={portrait} onChange={(event) => setOrientationOverride(event.target.checked ? "portrait" : "landscape")} /></label>}
          <label className="corner-body corner_option"><span>(H) HUD</span><input id="hud_checkbox" type="checkbox" checked={hudVisible} onChange={(event) => setHudVisible(event.target.checked)} /></label>
          <button className="corner-body corner_option" type="button" onClick={resetLocalStorage}>(T) Reset Local Storage</button>
        </section>
      </Corner>}
      {hudVisible && <Corner position="bottom_right">
        <section id="stats" aria-labelledby="stats_title">
          <div id="stats_title" className="corner-title">(V) Stats</div>
          <div id="version" className="corner-body">v{versionNumber}</div>
          <div className="corner-body">DPR: {devicePixelRatio}</div>
          <div id="aspect_ratio" className="corner-body">{activeLayout.label ?? `${activeLayout.width}:${activeLayout.height}`} Aspect</div>
          <div className="corner-body">{windowPixels.width}x{windowPixels.height} Window</div>
          <div className="corner-body">{viewportPixels.width}x{viewportPixels.height} Viewport</div>
        </section>
      </Corner>}
      {activeDialog && <Dialog title={activeDialog === "config" ? "Config" : activeDialog === "babylon" ? "Babylon Lite" : "Stats"} className={activeDialog === "babylon" ? "babylon_settings_dialog" : ""} onClose={() => setActiveDialog(null)}>
          {activeDialog === "babylon" ? <div className="dialog_options babylon_settings"><div>Babylon Lite</div><div>{renderResolutionText}</div><div>{getRenderScaleDisplayText(renderScale)}</div><div>Mode: 2DPixelPerfect</div></div>
            : activeDialog === "config" ? <div className="dialog_options">
            <label className="dialog_option"><span>(F) Fullscreen</span><input type="checkbox" checked={fullscreenPreferred} onChange={toggleFullscreen} /></label>
            <label className="dialog_option"><span>(P) Portrait</span><input type="checkbox" checked={portrait} onChange={(event) => setOrientationOverride(event.target.checked ? "portrait" : "landscape")} /></label>
            <label className="dialog_option"><span>(H) HUD</span><input type="checkbox" checked={hudVisible} onChange={(event) => setHudVisible(event.target.checked)} /></label>
            <button type="button" onClick={resetLocalStorage}>(T) Reset Local Storage</button>
          </div> : <div className="dialog_options"><div>v{versionNumber}</div><div>DPR: {devicePixelRatio}</div><div>{activeLayout.label ?? `${activeLayout.width}:${activeLayout.height}`} Aspect</div><div>{windowPixels.width}x{windowPixels.height} Window</div><div>{viewportPixels.width}x{viewportPixels.height} Viewport</div></div>}
      </Dialog>}
    </>}>{content}</BrowserSurface>
    </ViewportInfoContext.Provider>
  );
}
