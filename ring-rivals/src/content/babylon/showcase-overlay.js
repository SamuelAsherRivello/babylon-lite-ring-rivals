export function getRenderScaleDisplayText(scale) {
  const validScale = Number.isFinite(scale) && scale > 0 ? scale : 0;
  const formattedScale = Number.isInteger(validScale)
    ? String(validScale)
    : validScale.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  return `Render Scale: ${formattedScale}x`;
}
