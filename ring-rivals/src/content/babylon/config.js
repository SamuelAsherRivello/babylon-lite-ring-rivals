export const contentConfig = Object.freeze({
  renderer: "babylon-lite",
  style: "2d",
});

export const pixelPerfectOptions = Object.freeze({
  engine: Object.freeze({ msaaSamples: 1, alphaMode: "premultiplied" }),
  texture: Object.freeze({
    addressModeU: "clamp-to-edge",
    addressModeV: "clamp-to-edge",
    minFilter: "nearest",
    magFilter: "nearest",
    mipMaps: false,
  }),
});

export const logicalResolution = Object.freeze({ width: 480, height: 180 });
export const showcaseTileSize = 32;

export function getRenderingPolicy({ renderer, style }) {
  if (renderer !== "babylon-lite") return "renderer-specific";
  return style === "2d" ? "pixel-perfect" : style === "3d" ? "performance-scaled-3d" : "renderer-specific";
}
