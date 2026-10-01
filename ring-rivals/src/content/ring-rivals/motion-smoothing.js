const DEFAULT_BUFFER_MS = 110;
const MAX_SNAPSHOTS = 12;

function mix(a, b, amount) {
  return a + (b - a) * amount;
}

function mixFighter(before, after, amount) {
  if (!before) return after ? { ...after } : null;
  if (!after) return { ...before };
  return {
    ...after,
    x: mix(Number(before.x) || 0, Number(after.x) || 0, amount),
    hitFlash: mix(Number(before.hitFlash) || 0, Number(after.hitFlash) || 0, amount),
    actionFrame: Math.round(mix(Number(before.actionFrame) || 0, Number(after.actionFrame) || 0, amount)),
  };
}

/** Buffers authoritative Colyseus snapshots and samples them slightly in the past. */
export class SnapshotInterpolator {
  constructor(delayMs = DEFAULT_BUFFER_MS) {
    this.delayMs = delayMs;
    this.snapshots = [];
  }

  push(snapshot, receivedAt = performance.now()) {
    if (!snapshot || !Number.isFinite(snapshot.timestamp)) return;
    const item = { snapshot: structuredClone(snapshot), receivedAt };
    const existing = this.snapshots.findIndex(({ snapshot: current }) => current.timestamp === snapshot.timestamp);
    if (existing >= 0) this.snapshots[existing] = item;
    else this.snapshots.push(item);
    this.snapshots.sort((a, b) => a.snapshot.timestamp - b.snapshot.timestamp);
    if (this.snapshots.length > MAX_SNAPSHOTS) this.snapshots.splice(0, this.snapshots.length - MAX_SNAPSHOTS);
  }

  sample(now = performance.now()) {
    if (!this.snapshots.length) return null;
    if (this.snapshots.length === 1) return structuredClone(this.snapshots[0].snapshot);
    const latest = this.snapshots.at(-1);
    const targetTime = latest.snapshot.timestamp + Math.max(0, now - latest.receivedAt) - this.delayMs;
    let rightIndex = this.snapshots.findIndex(({ snapshot }) => snapshot.timestamp >= targetTime);
    if (rightIndex < 0) rightIndex = this.snapshots.length - 1;
    if (rightIndex === 0) return structuredClone(this.snapshots[0].snapshot);

    const before = this.snapshots[rightIndex - 1].snapshot;
    const after = this.snapshots[rightIndex].snapshot;
    const span = after.timestamp - before.timestamp;
    const t = span <= 0 ? 1 : Math.max(0, Math.min(1, (targetTime - before.timestamp) / span));
    const result = { ...after, timestamp: targetTime };
    result.players = after.players.map((fighter, index) => mixFighter(before.players[index], fighter, t));
    return result;
  }

  clear() { this.snapshots.length = 0; }
}

/** Local-only pose prediction. Combat state remains server-authoritative. */
export function predictLocalPose(authoritative, action, elapsedMs, predictedAt = performance.now()) {
  if (!authoritative) return null;
  const result = { ...authoritative };
  if (action !== "dodge-left" && action !== "dodge-right") return result;
  const direction = action === "dodge-left" ? -1 : 1;
  const progress = Math.max(0, Math.min(1, elapsedMs / 400));
  const predictedOffset = direction * Math.sin(progress * Math.PI) * 1.25;
  // Decay any authority correction so packet cadence cannot visibly snap the boxer.
  const correction = Number(authoritative.x) || 0;
  result.x = predictedOffset + correction * Math.exp(-Math.max(0, predictedAt - (authoritative.receivedAt ?? predictedAt)) / 85);
  return result;
}

export function reconcilePose(renderedX, authoritativeX, elapsedMs, halfLifeMs = 55) {
  const alpha = 1 - Math.exp(-Math.max(0, elapsedMs) * Math.LN2 / halfLifeMs);
  return mix(Number(renderedX) || 0, Number(authoritativeX) || 0, Math.min(1, alpha));
}
