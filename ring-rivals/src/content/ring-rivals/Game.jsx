import { useEffect, useMemo, useRef, useState } from "react";
import { MultiplayerClient } from "@rmc/multiplayer-client";
import { SnapshotInterpolator, predictLocalPose, reconcilePose } from "./motion-smoothing.js";

const ENDPOINT = import.meta.env.VITE_MULTIPLAYER_ENDPOINT || "https://rmc-colyseus-multiplayer-server.vercel.app";
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

function Boxer({ fighter, foreground, visualX = 0 }) {
  if (!fighter) return <div className={`fighter-placeholder ${foreground ? "foreground" : "opponent"}`}>WAITING FOR RIVAL</div>;
  const backView = foreground;
  const flash = fighter.hitFlash > 0;
  return <div className={`pixel-boxer ${foreground ? "foreground" : "opponent"} boxer-${fighter.boxer} action-${fighter.action} ${flash ? "hit-flash" : ""}`}
    style={{ "--fighter-x": `${visualX * (foreground ? 7 : 12)}%` }} aria-label={`${fighter.boxer}, ${foreground ? "your boxer" : "opponent"}`}>
    <svg viewBox="0 0 100 120" role="img" aria-hidden="true" shapeRendering="crispEdges">
      <ellipse cx="50" cy="111" rx="32" ry="6" fill="#15212d" opacity=".55" />
      <path d="M31 83h15v25H31zM55 82h15v26H55z" fill={fighter.boxer === "rook" ? "#d75c35" : "#1a9b9f"} />
      <path d="M25 58h50v33H25z" fill={fighter.boxer === "rook" ? "#c53d2d" : "#17677d"} />
      <path d="M18 48h18v17H18zM64 48h18v17H64z" fill="#efc18b" />
      <path d="M25 42h50v26H25z" fill={fighter.boxer === "rook" ? "#ad352b" : "#13586d"} />
      <path d="M29 19h42v34H29z" fill="#b97853" />
      {backView ? <path d="M26 18h48v31H26z" fill="#242836" /> : <>
        <path d="M27 16h46v12H27z" fill="#242836" />
        <path d="M35 33h8v5h-8zM57 33h8v5h-8z" fill="#f6ead2" />
        <path d="M43 45h14v4H43z" fill="#5b2631" />
      </>}
      <path d="M18 48h22v15H18zM60 48h22v15H60z" fill="#f2cf42" />
    </svg>
    <span className="fighter-name">{fighter.boxer === "rook" ? "ROOK" : "FLASH"}</span>
  </div>;
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
          const visualAction = intent && now - intent.startedAt < 500
            ? (intent.action.includes("-") && intent.action.startsWith("jab") || intent.action.startsWith("cross") ? `attack-${intent.action}` : intent.action)
            : fighter.action;
          return { ...fighter, action: local ? visualAction : fighter.action, displayX: smoothedX };
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
  return <div className="ring-stage" aria-label="Boxing match">
    <div className="arena-sky" />
    <div className="arena-scoreboard">
      <div><b>{visibleRival.boxer.toUpperCase()}</b><span>HEALTH {Math.ceil(visibleRival.health ?? 100)}</span><span>STAMINA {Math.ceil(visibleRival.stamina ?? 100)}</span></div>
      <div className="round-clock"><strong>{frame?.roundSeconds ?? 60}</strong><small>ROUND {frame?.round ?? 1} · {frame?.rounds?.[1 - mySeat] ?? 0}–{frame?.rounds?.[mySeat] ?? 0}</small></div>
      <div className="score-right"><b>{visibleMine.boxer.toUpperCase()}</b><span>HEALTH {Math.ceil(visibleMine.health ?? 100)}</span><span>STAMINA {Math.ceil(visibleMine.stamina ?? 100)}</span></div>
    </div>
    <div className="arena-crowd" />
    <div className="ring-ropes"><i/><i/><i/></div>
    <div className="stage-boxers"><Boxer fighter={visibleRival} /><Boxer fighter={visibleMine} foreground visualX={myFighter?.displayX ?? 0} /></div>
    {frame?.phase === "countdown" && <div className="fight-call">{frame.countdown}</div>}
    {frame?.phase === "intermission" && <div className="fight-call">ROUND {frame.round - 1} · {frame.result}</div>}
    {frame?.phase === "matchover" && <div className="fight-call">{frame.result}{frame.winner == null ? " · DRAW" : frame.winner === mySeat ? " · YOU WIN" : " · YOU LOSE"}</div>}
  </div>;
}

export function RingRivalsGame() {
  const [state, setState] = useState({ status: "idle", players: [], gameState: null, error: "", code: "" });
  const [invite, setInvite] = useState("");
  const [boxer, setBoxer] = useState("rook");
  const [muted, setMuted] = useState(() => new URLSearchParams(location.search).get("mute") === "1");
  const sessionRef = useRef(null);
  const localIntent = useRef(null);
  const sequence = useRef(0);
  const previousState = useRef(null);

  useEffect(() => {
    const session = new MultiplayerClient(ENDPOINT, "ring-rivals");
    sessionRef.current = session;
    const unsubscribe = session.subscribe((next) => setState({ ...next, players: [...(next.players ?? [])] }));
    return () => { unsubscribe(); session.disconnect(); sessionRef.current = null; };
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
    localIntent.current = { action, startedAt: now };
    session.send("input", { action, sequence: sequence.current++ });
    window.setTimeout(() => { if (localIntent.current?.startedAt === now && !action.startsWith("guard")) localIntent.current = null; }, action.startsWith("dodge") ? 420 : 520);
  };
  const connect = (create) => {
    const code = invite.trim().toUpperCase();
    const session = new MultiplayerClient(ENDPOINT, "ring-rivals", create ? { create: true } : { code });
    sessionRef.current?.disconnect();
    sessionRef.current = session;
    session.subscribe((next) => setState({ ...next, players: [...(next.players ?? [])] }));
    void session.connect();
  };
  const localSeat = state.players.find((player) => player.id === state.sessionId)?.seat;
  const myFighter = localSeat == null ? null : state.gameState?.players?.[localSeat];
  const selectBoxer = (value) => { setBoxer(value); sessionRef.current?.send("select", { boxer: value }); };

  return <main className="game-shell">
    <header className="game-topbar"><div className="brand-mark">RR <span>RING RIVALS</span></div><div className="room-status">{state.status === "connected" ? `ONLINE · ${state.code || state.roomId || "PRIVATE BOUT"}` : state.status.toUpperCase()}</div><div className="topbar-actions">{state.status === "connected" && <button onClick={() => sessionRef.current?.disconnect()}>LEAVE RING</button>}<button className="mute-button" onClick={() => { setMuted((current) => { const next = !current; const url = new URL(location.href); if (next) url.searchParams.set("mute", "1"); else url.searchParams.delete("mute"); history.replaceState(null, "", url); return next; }); }} aria-pressed={muted}>{muted ? "SOUND OFF" : "SOUND ON"}</button></div></header>
    <FighterStage state={state} sessionId={state.sessionId} localIntent={localIntent} />
    <section className="game-controls">
      {state.status !== "connected" ? <div className="lobby-card"><p className="eyebrow">ONLINE ARCADE BOXING · 2 PLAYERS</p><h1>STEP INTO THE RING</h1><p>Create a private bout, then send the room code to your rival.</p>
        <div className="lobby-actions"><button onClick={() => connect(true)}>CREATE PRIVATE ROOM</button><label>ROOM CODE<input value={invite} onChange={(event) => setInvite(event.target.value.toUpperCase().slice(0, 6))} maxLength={6} placeholder="6 LETTER CODE" /></label><button disabled={invite.trim().length !== 6} onClick={() => connect(false)}>JOIN BOUT</button></div>
        {state.error && <p className="connection-error" role="status">{state.error}</p>}
      </div> : !state.gameState || state.gameState.phase === "lobby" ? <div className="lobby-card"><p className="eyebrow">ROOM {state.code || state.roomId} · {state.players.length}/2 BOXERS</p><h1>CHOOSE YOUR BOXER</h1><p>Share this private room code with your rival.</p><div className="lobby-ready"><div className="boxer-select"><button className={(myFighter?.boxer ?? boxer) === "rook" ? "selected" : ""} onClick={() => selectBoxer("rook")}>ROOK</button><button className={(myFighter?.boxer ?? boxer) === "flash" ? "selected" : ""} onClick={() => selectBoxer("flash")}>FLASH</button></div><button disabled={state.players.length < 2 || myFighter?.ready} onClick={() => sessionRef.current?.send("ready")}>{myFighter?.ready ? "WAITING FOR RIVAL…" : "READY TO FIGHT"}</button></div></div> : <div className="fight-controls"><div className="move-grid">{ACTIONS.map(([action, title]) => <button key={action} onPointerDown={(event) => { event.preventDefault(); sendAction(action); }} onPointerUp={() => { if (action.startsWith("guard")) sendAction("neutral"); }} onPointerCancel={() => sendAction("neutral")}>{title}</button>)}</div><div className="fight-foot">Keyboard: Z/X head punches · A/S body punches · ↑/↓ guard · ←/→ dodge <button onClick={() => sessionRef.current?.send(state.gameState.phase === "matchover" ? "rematch" : "ready")}>{state.gameState.phase === "matchover" ? "REMATCH" : "READY"}</button></div></div>}
    </section>
    <footer className="game-footer">ROOK · COUNTER PUNCHER <span>1–2–3, FIGHT!</span> FLASH · SPEED BOXER</footer>
  </main>;
}
