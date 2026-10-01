// Change these presets to update the template's supported aspect ratios in one place.
// Layout dimensions are CSS pixels; renderer resolution and DPR belong to a future integration.
export const aspectRatioPresets = Object.freeze({
  landscape: Object.freeze({ width: 16, height: 9, label: "16:9" }),
});

export const defaultLayout = Object.freeze({
  orientation: "landscape",
  ...aspectRatioPresets.landscape,
});

export function validateLayout(layout) {
  const { width, height, orientation } = layout;
  if (![width, height].every((value) => Number.isFinite(value) && value > 0)) {
    throw new Error("Viewport width and height must be finite positive numbers; for example, 16 and 9.");
  }
  const matches = { portrait: width < height, landscape: width > height, square: width === height };
  if (!Object.hasOwn(matches, orientation) || !matches[orientation]) {
    throw new Error("Viewport orientation must match its ratio: portrait width < height, landscape width > height, or square width = height.");
  }
  if (!Number.isFinite(width / height) || width / height <= 0) {
    throw new Error("Viewport ratio is outside the supported numeric range; use smaller ratio dimensions.");
  }
  return layout;
}

export function fitViewport(surfaceWidth, surfaceHeight, layout) {
  validateLayout(layout);
  if (![surfaceWidth, surfaceHeight].every((value) => Number.isFinite(value) && value >= 0)) {
    throw new Error("Browser surface dimensions must be finite nonnegative CSS pixel values.");
  }
  const ratio = layout.width / layout.height;
  const width = Math.min(surfaceWidth, surfaceHeight * ratio);
  const height = width / ratio;
  return { width, height, x: (surfaceWidth - width) / 2, y: (surfaceHeight - height) / 2 };
}
