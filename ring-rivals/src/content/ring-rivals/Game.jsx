import { useEffect, useMemo, useRef, useState } from "react";
import { MultiplayerClient } from "@rmc/multiplayer-client";
import { LOCAL_ACTION_PREDICTION_WINDOW_MS, SnapshotInterpolator, predictLocalPose, reconcilePose } from "./motion-smoothing.js";
import { Content } from "../Content.jsx";

const ENDPOINT = import.meta.env.VITE_MULTIPLAYER_URL || import.meta.env.VITE_MULTIPLAYER_ENDPOINT || "https://rmc-colyseus-multiplayer-server.vercel.app";
const ACTIONS = [
  ["jab-head", "JAB · HEAD"], ["cross-head", "CROSS · HEAD"], ["jab-body", "JAB · BODY"], ["cross-body", "CROSS · BODY"],
  ["guard-high", "HIGH GUARD"], ["guard-low", "LOW GUARD"], ["dodge-left", "DODGE LEFT"], ["dodge-right", "DODGE RIGHT"],
];
let audioContext;
function soundCue(kind, muted) {
  if (muted) return;
  try {
    audioContext ??= new AudioContext();
    if (audioContext.state === "suspended") void audioContext.resume();
    const now = audioContext.currentTime;
    const presets = {
      bell: [880, 0.28, "square", 440], punch: [170, 0.09, "triangle", 70],
      body: [110, 0.14, "sawtooth", 55], block: [520, 0.08, "square", 210],
      dodge: [310, 0.11, "triangle", 700], knockout: [72, 0.65, "sawtooth", 28],
    };
    const [start, duration, type, end] = presets[kind];
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(start, now);
    oscillator.frequency.exponentialRampToValueAtTime(end, now + duration);
    volume.gain.setValueAtTime(0.0001, now);
    volume.gain.exponentialRampToValueAtTime(kind === "knockout" ? 0.14 : 0.07, now + 0.01);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(volume).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  } catch { /* Sound remains optional on devices without Web Audio. */ }
}

function FighterStage({ state, sessionId, localIntent }) {
  const buffer = useMemo(() => new SnapshotInterpolator(105), []);
  const [frame, setFrame] = useState(null);
  const lastVisualX = useRef([0, 0]);
  const lastFrameAt = useRef(0);

  useEffect(() => {
    if (state.gameState) buffer.push(state.gameState);
  }, [state.gameState, buffer]);

  useEffect(() => {
    let id;
    const draw = (now) => {
      const sampled = buffer.sample(now);
      if (sampled) {
        const localSeat = state.players.find((player) => player.id === sessionId)?.seat ?? 0;
        const elapsed = lastFrameAt.current ? now - lastFrameAt.current : 16;
        const players = sampled.players.map((fighter, seat) => {
          if (!fighter) return null;
          const local = seat === localSeat;
          const intent = local && localIntent.current;
          const predicted = local && intent
            ? predictLocalPose({ ...fighter, x: 0, receivedAt: now }, intent.action, now - intent.startedAt, now)
            : fighter;
          const smoothedX = reconcilePose(lastVisualX.current[seat], predicted.x, elapsed);
          lastVisualX.current[seat] = smoothedX;
          const rawIntent = intent?.action ?? "";
          const visualAction = rawIntent.startsWith("jab-") || rawIntent.startsWith("cross-")
            ? `attack-${rawIntent}` : rawIntent;
          const predictedFrame = intent ? Math.floor(Math.max(0, now - intent.startedAt) * 0.03) : 0;
          const predictionWindow = LOCAL_ACTION_PREDICTION_WINDOW_MS;
          if (intent && fighter.action === visualAction) intent.acknowledged = true;
          const predict = local && intent && !intent.acknowledged && now - intent.startedAt < predictionWindow;
          return {
            ...fighter,
            action: local ? (predict ? visualAction : fighter.action) : fighter.action,
            actionFrame: fighter.actionFrame,
            predictedAction: predict ? visualAction : null,
            predictedFrame,
            displayX: smoothedX,
          };
        });
        setFrame({ ...sampled, players, localSeat });
      }
      lastFrameAt.current = now;
      id = requestAnimationFrame(draw);
    };
    id = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(id);
  }, [buffer, sessionId, state.players, localIntent]);

  const mySeat = frame?.localSeat ?? 0;
  const myFighter = frame?.players?.[mySeat] ?? state.gameState?.players?.[mySeat];
  const theirFighter = frame?.players?.[1 - mySeat] ?? state.gameState?.players?.[1 - mySeat];
  const visibleMine = myFighter ?? { boxer: "rook", action: "idle", health: 100, stamina: 100, hitFlash: 0 };
  const visibleRival = theirFighter ?? { boxer: "flash", action: "idle", health: 100, stamina: 100, hitFlash: 0 };
  const renderedFighters = frame?.players ?? [visibleMine, visibleRival];
  return <div className="ring-stage" aria-label="Boxing match">
    <div className="arena-scoreboard">
      <div><b>{visibleRival.boxer.toUpperCase()}</b><span>HEALTH {Math.ceil(visibleRival.health ?? 100)}</span><span>STAMINA {Math.ceil(visibleRival.stamina ?? 100)}</span></div>
      <div className="round-clock"><strong>{frame?.roundSeconds ?? 60}</strong><small>ROUND {frame?.round ?? 1} · {frame?.rounds?.[1 - mySeat] ?? 0}–{frame?.rounds?.[mySeat] ?? 0}</small></div>
      <div className="score-right"><b>{visibleMine.boxer.toUpperCase()}</b><span>HEALTH {Math.ceil(visibleMine.health ?? 100)}</span><span>STAMINA {Math.ceil(visibleMine.stamina ?? 100)}</span></div>
    </div>
    <Content fighters={renderedFighters} localSeat={frame?.localSeat ?? mySeat} />
    {frame?.phase === "countdown" && <div className="fight-call">{frame.countdown}</div>}
    {frame?.phase === "intermission" && <div className="fight-call">ROUND {frame.round - 1} · {frame.result}</div>}
    {frame?.phase === "matchover" && <div className="fight-call">{frame.result}{frame.winner == null ? " · DRAW" : frame.winner === mySeat ? " · YOU WIN" : " · YOU LOSE"}</div>}
  </div>;
}

export function RingRivalsGame() {
  const [state, setState] = useState({ status: "idle", players: [], gameState: null, error: "", code: "" });
  const [invite, setInvite] = useState(() => new URLSearchParams(location.search).get("room")?.toUpperCase().slice(0, 4) ?? "");
  const [shareMessage, setShareMessage] = useState("");
  const [boxer, setBoxer] = useState("rook");
  const [muted, setMuted] = useState(() => new URLSearchParams(location.search).get("mute") === "1");
  const sessionRef = useRef(null);
  const sessionUnsubscribeRef = useRef(null);
  const inviteAutoconnectStartedRef = useRef(false);
  const localIntent = useRef(null);
  const sequence = useRef(0);
  const previousState = useRef(null);

  useEffect(() => {
    const session = new MultiplayerClient(ENDPOINT, "ring-rivals");
    sessionRef.current = session;
    sessionUnsubscribeRef.current = session.subscribe((next) => setState({ ...next, players: [...(next.players ?? [])] }));
    return () => { sessionUnsubscribeRef.current?.(); sessionUnsubscribeRef.current = null; sessionRef.current?.disconnect(); sessionRef.current = null; };
  }, []);

  useEffect(() => {
    const next = state.gameState;
    const previous = previousState.current;
    if (!next) return;
    if (next.phase === "round" && previous?.phase !== "round") soundCue("bell", muted);
    if (next.phase === "matchover" && previous?.phase !== "matchover") soundCue(next.winner == null ? "bell" : "knockout", muted);
    for (let seat = 0; seat < 2; seat += 1) {
      const fighter = next.players?.[seat];
      const before = previous?.players?.[seat];
      if (!fighter) continue;
      if (fighter.action !== before?.action && fighter.action.startsWith("attack-")) soundCue(fighter.action.includes("body") ? "body" : "punch", muted);
      if (fighter.action !== before?.action && fighter.action === "hit-block") soundCue("block", muted);
      if (fighter.action !== before?.action && fighter.action.startsWith("dodge-")) soundCue("dodge", muted);
    }
    previousState.current = next;
  }, [state.gameState, muted]);

  useEffect(() => {
    const keys = { z: "jab-head", x: "cross-head", a: "jab-body", s: "cross-body", ArrowUp: "guard-high", ArrowDown: "guard-low", ArrowLeft: "dodge-left", ArrowRight: "dodge-right" };
    const pressed = new Set();
    const handleKey = (event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      const action = keys[event.key.length === 1 ? event.key.toLowerCase() : event.key];
      if (!action) return;
      event.preventDefault();
      if (event.repeat || pressed.has(event.key)) return;
      pressed.add(event.key);
      if (action.startsWith("guard")) sendAction(action);
      else sendAction(action);
    };
    const release = (event) => pressed.delete(event.key);
    const neutralize = () => { pressed.clear(); if (state.status === "connected") sendAction("neutral"); localIntent.current = null; };
    window.addEventListener("keydown", handleKey);
    const releaseAction = (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (keys[key]?.startsWith("guard") && pressed.has(event.key)) sendAction("neutral");
      release(event);
    };
    window.addEventListener("keyup", releaseAction);
    window.addEventListener("blur", neutralize);
    const gamepadHeld = new Set();
    const gamepadActions = [[0, "jab-head"], [1, "cross-head"], [2, "jab-body"], [3, "cross-body"], [4, "guard-low"], [5, "guard-high"], [12, "guard-high"], [13, "guard-low"], [14, "dodge-left"], [15, "dodge-right"]];
    const guardButtons = new Set([4, 5, 12, 13]);
    const pollGamepads = () => {
      const gamepad = navigator.getGamepads?.().find(Boolean);
      if (gamepad) {
        const active = new Set();
        for (const [index, action] of gamepadActions) {
          if (gamepad.buttons[index]?.pressed) active.add(index);
        }
        const xAxis = gamepad.axes[0] ?? 0;
        const yAxis = gamepad.axes[1] ?? 0;
        if (xAxis < -0.65) active.add(14);
        if (xAxis > 0.65) active.add(15);
        if (yAxis < -0.65) active.add(5);
        if (yAxis > 0.65) active.add(4);
        for (const index of active) {
          if (!gamepadHeld.has(index)) sendAction(gamepadActions.find(([button]) => button === index)[1]);
        }
        if ([...guardButtons].some((index) => gamepadHeld.has(index) && !active.has(index))) sendAction("neutral");
        gamepadHeld.clear();
        active.forEach((button) => gamepadHeld.add(button));
      } else if (gamepadHeld.size) {
        if ([...guardButtons].some((index) => gamepadHeld.has(index))) sendAction("neutral");
        gamepadHeld.clear();
      }
      gamepadFrame = requestAnimationFrame(pollGamepads);
    };
    let gamepadFrame = requestAnimationFrame(pollGamepads);
    return () => { cancelAnimationFrame(gamepadFrame); window.removeEventListener("keydown", handleKey); window.removeEventListener("keyup", releaseAction); window.removeEventListener("blur", neutralize); };
  }, [state.status]);

  const sendAction = (action) => {
    const session = sessionRef.current;
    if (!session || state.status !== "connected") return;
    const now = performance.now();
    localIntent.current = { action, startedAt: now, acknowledged: false };
    session.send("input", { action, sequence: sequence.current++ });
    if (!action.startsWith("guard")) {
      window.setTimeout(() => { if (localIntent.current?.startedAt === now) localIntent.current = null; }, LOCAL_ACTION_PREDICTION_WINDOW_MS + 50);
    }
  };
  const connect = (create, roomCode = invite) => {
    const code = roomCode.trim().toUpperCase();
    const session = new MultiplayerClient(ENDPOINT, "ring-rivals", create ? { create: true, ...(code ? { code } : {}) } : { code });
    sessionUnsubscribeRef.current?.();
    sessionRef.current?.disconnect();
    sessionRef.current = session;
    sessionUnsubscribeRef.current = session.subscribe((next) => setState({ ...next, players: [...(next.players ?? [])] }));
    void session.connect();
  };
  const copyInvite = async () => {
    const code = state.code || state.gameState?.code;
    if (!code) return;
    const url = new URL(location.href);
    url.searchParams.set("room", code);
    try { await navigator.clipboard.writeText(url.href); setShareMessage("ROOM LINK COPIED"); }
    catch { setShareMessage(`SHARE CODE ${code}`); }
  };
  useEffect(() => {
    const code = new URLSearchParams(location.search).get("room")?.trim().toUpperCase();
    if (!/^[A-Z0-9]{4}$/.test(code ?? "")) return;
    let active = true;
    const timer = window.setTimeout(() => {
      if (!active || inviteAutoconnectStartedRef.current) return;
      inviteAutoconnectStartedRef.current = true;
      connect(false, code);
    }, 0);
    return () => { active = false; window.clearTimeout(timer); };
  }, []);
  const localSeat = state.players.find((player) => player.id === state.sessionId)?.seat;
  const myFighter = localSeat == null ? null : state.gameState?.players?.[localSeat];
  const selectBoxer = (value) => { setBoxer(value); sessionRef.current?.send("select", { boxer: value }); };

  return <main className="game-shell">
    <header className="game-topbar"><div className="brand-mark">RR <span>RING RIVALS</span></div><div className="room-status">{state.status === "connected" ? `ONLINE · ${state.code || state.roomId || "PRIVATE BOUT"}` : state.status.toUpperCase()}</div><div className="topbar-actions">{state.status === "connected" && <button onClick={() => sessionRef.current?.disconnect()}>LEAVE RING</button>}<button className="mute-button" onClick={() => { setMuted((current) => { const next = !current; const url = new URL(location.href); if (next) url.searchParams.set("mute", "1"); else url.searchParams.delete("mute"); history.replaceState(null, "", url); return next; }); }} aria-pressed={muted}>{muted ? "SOUND OFF" : "SOUND ON"}</button></div></header>
    <FighterStage state={state} sessionId={state.sessionId} localIntent={localIntent} />
    <section className="game-controls">
      {state.status === "reconnecting" ? <div className="lobby-card" role="status"><p className="eyebrow">ROOM {state.code || state.roomId}</p><h1>RECOVERING YOUR SEAT</h1><p>{state.error || "The connection dropped. Rejoining your bout…"}</p></div>
      : state.status !== "connected" ? <div className="lobby-card"><p className="eyebrow">ONLINE ARCADE BOXING · 2 PLAYERS</p><h1>STEP INTO THE RING</h1><p>Create a private bout, then send the room code to your rival.</p>
        <div className="lobby-actions"><button onClick={() => connect(true, invite.trim().toUpperCase())}>CREATE PRIVATE ROOM</button><label>ROOM CODE<input value={invite} onChange={(event) => setInvite(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4))} maxLength={4} placeholder="4 CHARACTER CODE" /></label><button disabled={invite.trim().length !== 4} onClick={() => connect(false)}>JOIN BOUT</button></div>
        {state.error && <p className="connection-error" role="status">{state.error}</p>}
      </div> : !state.gameState || state.gameState.phase === "lobby" ? <div className="lobby-card"><p className="eyebrow">ROOM {state.code || state.roomId} · {state.players.length}/2 BOXERS</p><h1>CHOOSE YOUR BOXER</h1><p>Share this private room code with your rival.</p><div className="lobby-ready"><div className="boxer-select"><button className={(myFighter?.boxer ?? boxer) === "rook" ? "selected" : ""} onClick={() => selectBoxer("rook")}>ROOK</button><button className={(myFighter?.boxer ?? boxer) === "flash" ? "selected" : ""} onClick={() => selectBoxer("flash")}>FLASH</button></div><button disabled={state.players.length < 2 || myFighter?.ready} onClick={() => sessionRef.current?.send("ready")}>{myFighter?.ready ? "WAITING FOR RIVAL…" : "READY TO FIGHT"}</button></div><button onClick={copyInvite}>COPY ROOM LINK</button><p role="status">{shareMessage}</p></div> : <div className="fight-controls"><div className="move-grid">{ACTIONS.map(([action, title]) => <button key={action} onPointerDown={(event) => { event.preventDefault(); sendAction(action); }} onPointerUp={() => { if (action.startsWith("guard")) sendAction("neutral"); }} onPointerCancel={() => sendAction("neutral")}>{title}</button>)}</div><div className="fight-foot">Keyboard: Z/X head punches · A/S body punches · ↑/↓ guard · ←/→ dodge <button onClick={() => sessionRef.current?.send(state.gameState.phase === "matchover" ? "rematch" : "ready")}>{state.gameState.phase === "matchover" ? "REMATCH" : "READY"}</button></div></div>}
    </section>
    <footer className="game-footer">ROOK · COUNTER PUNCHER <span>1–2–3, FIGHT!</span> FLASH · SPEED BOXER</footer>
  </main>;
}
