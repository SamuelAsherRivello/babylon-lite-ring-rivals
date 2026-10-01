export function getInitializationMessage(webGpuAvailable, error) {
  const reason = String(error?.message ?? error ?? "");
  if (!webGpuAvailable || /webgpu.*(?:not available|unsupported)|adapter.*(?:not available|unsupported|not found)/i.test(reason)) {
    return "Babylon Lite requires WebGPU. Enable WebGPU or use a compatible browser and device.";
  }
  if (/render.?target|allocat(?:e|ion)|out of memory|device lost|texture.*(?:limit|dimension|memory)/i.test(reason)) {
    return "Babylon Lite could not allocate the selected render resolution. Choose a smaller resolution or viewport, then check the browser console for details.";
  }
  return "Babylon Lite could not initialize this content. Check the browser console for details.";
}
