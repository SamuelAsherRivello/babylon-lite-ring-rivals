const ATTACKS = Object.freeze({ "attack-jab-head": 18, "attack-cross-head": 27, "attack-jab-body": 21, "attack-cross-body": 30 });
const CLIPS = Object.freeze({ idle: 0, "attack-jab-head": 1, "attack-cross-head": 2, "attack-jab-body": 3, "attack-cross-body": 4, "guard-high": 5, "guard-low": 6, "dodge-left": 7, "dodge-right": 8, "hit-block": 9, "hit-stun": 10 });
function phaseFor(action, frame, timeMs) {
  if (action === "idle") return Math.floor(timeMs / 650) % 3;
  if (action.startsWith("attack-")) { const p = Math.max(0, frame) / (ATTACKS[action] ?? 18); return p < 0.34 ? 0 : p < 0.72 ? 1 : 2; }
  if (action.startsWith("dodge-")) return frame < 3 ? 0 : frame < 8 ? 1 : 2;
  if (action.startsWith("hit-")) return frame < 3 ? 0 : frame < 7 ? 1 : 2;
  return 1;
}
export function getBoxerAnimation(fighter, { local = false, view = "front", timeMs = 0 } = {}) {
  let action = fighter?.predictedAction ?? fighter?.action ?? "idle";
  let frame = fighter?.predictedFrame ?? fighter?.actionFrame ?? 0;
  if (!Object.hasOwn(CLIPS, action)) action = "idle";
  const phase = phaseFor(action, frame, timeMs), clip = CLIPS[action];
  const attack = action.startsWith("attack-"), dodge = action.startsWith("dodge-");
  const progress = attack ? Math.max(0, Math.min(1, frame / (ATTACKS[action] ?? 18))) : 0;
  const reach = attack ? Math.sin(Math.PI * progress) : 0;
  return {
    action,
    frame: (((fighter?.boxer === "flash" ? 1 : 0) * 2 + (view === "front" ? 1 : 0)) * 11 + clip) * 3 + phase,
    offsetX: dodge ? (frame <= 0 || frame >= 12 ? 0 : (action.endsWith("left") ? -1 : 1) * Math.sin(Math.PI * frame / 12) * 7) : attack && reach > 0 ? (action.startsWith("attack-cross") ? 1 : -1) * reach * 3.5 : action.startsWith("hit-") ? [-3, 4, 0][phase] : 0,
    offsetY: action === "guard-low" ? 5 : action.endsWith("-body") && attack ? 5 * reach : action === "hit-stun" ? [0, 4, 0][phase] : 0,
    sizeX: local ? 52 : 76, sizeY: local ? 104 : 152,
    attackCue: attack ? (action.endsWith("-head") ? "head" : "body") : null,
  };
}
export const BOXER_ATLAS = Object.freeze({ cellWidth: 64, cellHeight: 128, columns: 11, rows: 12 });
