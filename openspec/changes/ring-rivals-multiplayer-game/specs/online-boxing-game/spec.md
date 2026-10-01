# Spec Delta

## Purpose

Defines private online boxing matches in which two players choose original boxers, read and answer each other's attacks, and play a short multi-round bout from independent opponent-focused views.

## ADDED Requirements

### Requirement: Players can create and join private matches
The game SHALL let a player create an invite room and join an existing room with its shareable code. Each match room SHALL admit exactly two players and SHALL report invalid, expired, and full-room conditions clearly.

#### Scenario: Create and share a room
- **WHEN** a player creates a match room
- **THEN** the game assigns a shareable code and waits for one opponent

#### Scenario: Join with a valid code
- **WHEN** a second player enters the room's valid code
- **THEN** both clients join the same match and see each other's room presence

#### Scenario: Reject an invalid or full room
- **WHEN** a player enters an invalid, expired, or already-full room code
- **THEN** the game shows the corresponding error and does not start a different match silently

### Requirement: Players select one of two original boxers
The game SHALL provide exactly two original, visually distinct boxer choices. Either player SHALL be able to choose either boxer, including choosing the same boxer as the opponent.

#### Scenario: Select boxers before a bout
- **WHEN** both players are in the room lobby
- **THEN** each can select either boxer, see the opponent's selection, and ready up

#### Scenario: Begin only when both players are ready
- **WHEN** one player is ready and the other is not
- **THEN** the match remains in the lobby until both have selected a boxer and readied

### Requirement: Each client receives its own opponent-focused view
The game SHALL render the local boxer smaller in the foreground from behind and the remote boxer larger and facing the local player. The online view SHALL use a fixed landscape 16:9 playfield without a user-facing orientation toggle, shortcut, or persisted override.

#### Scenario: Player one views the match
- **WHEN** player one is in a bout
- **THEN** player one's boxer appears in the foreground from behind and player two faces player one across the ring

#### Scenario: Player two views the same match
- **WHEN** player two is in the same bout
- **THEN** player two sees player two's boxer from behind and player one facing player two, without changing authoritative identities or combat results

#### Scenario: Client viewport changes shape
- **WHEN** the browser viewport is portrait or landscape
- **THEN** the fixed landscape playfield remains correctly oriented and fitted without stretching or offering an orientation setting

### Requirement: Boxers can attack and defend in real time
Each player SHALL be able to use readable head and body punches, guard, and evasive movement during simultaneous real-time combat. Attack startup, active time, recovery, hit-stun, and defense outcomes SHALL be consistent and observable to both clients.

#### Scenario: Read and counter an attack
- **WHEN** a boxer telegraphs and throws an attack while the opponent defends or counters in its valid timing window
- **THEN** the authoritative result reflects the attack timing, target, guard or evasion, and recovery state

#### Scenario: Reject invalid combat input
- **WHEN** a client submits malformed, out-of-range, stale, or unauthorized input
- **THEN** the server ignores or rejects it without accepting client-supplied positions, damage, health, or match results

### Requirement: The server owns shared combat and match outcomes
The server SHALL authoritatively simulate both players' validated inputs, boxer state, attacks, defense, damage, health, stamina, round timer, score, and match phase. Clients SHALL render server state without deciding hits or changing outcomes.

#### Scenario: Both clients observe the same result
- **WHEN** an attack hits, is guarded, or is evaded
- **THEN** both clients receive the same authoritative health, stamina, reaction, and match-state result

#### Scenario: Late join cannot take over a bout
- **WHEN** a third client attempts to join an active two-player room
- **THEN** the server rejects that client as full and leaves the bout unchanged

### Requirement: Boxer motion renders smoothly between server updates
Clients SHALL use local input prediction and timestamped remote-state interpolation or equivalent smoothing so both boxers move smoothly between authoritative snapshots. Corrections SHALL converge to server state without changing combat outcomes.

#### Scenario: Local boxer responds between snapshots
- **WHEN** the local player presses a movement or evasion control between server snapshots
- **THEN** the local boxer begins moving immediately and reconciles to authoritative state as updates arrive

#### Scenario: Remote boxer moves between snapshots
- **WHEN** two or more timestamped snapshots arrive for the opponent
- **THEN** the client interpolates the displayed opponent pose between snapshots rather than stepping abruptly at each update

#### Scenario: Prediction disagrees with authority
- **WHEN** a predicted pose differs from the server's authoritative pose
- **THEN** the client smoothly corrects the displayed pose while the server's combat and match result remain authoritative

### Requirement: Matches use best-of-three timed rounds
An online match SHALL use a short ready countdown and best-of-three rounds. A knockout SHALL end the current round; when time expires, the boxer with more remaining health SHALL win that round. An exact health tie SHALL draw the round without changing score. The match SHALL end when a boxer wins two rounds, or as a draw after three rounds if neither has won twice.

#### Scenario: Win by knockout
- **WHEN** a boxer's health reaches zero
- **THEN** the opponent wins the round and the game announces the updated match score

#### Scenario: Win when time expires
- **WHEN** the round timer expires and the boxers have different remaining health
- **THEN** the boxer with more health wins that round

#### Scenario: Draw a tied round
- **WHEN** the round timer expires with equal remaining health
- **THEN** the round is drawn and neither player's round score changes

#### Scenario: Complete a match
- **WHEN** a boxer wins two rounds or three rounds finish without either boxer winning twice
- **THEN** the game declares the winner or a match draw and offers a rematch or return to the room flow

### Requirement: A brief disconnect can recover the same bout
The game SHALL allow a disconnected player up to 15 seconds to rejoin the same room and reclaim their boxer and match identity. During this interval the server SHALL stop that player's input and suspend the bout timer; after expiry, the connected opponent SHALL win by forfeit.

#### Scenario: Reconnect within the grace period
- **WHEN** a player reconnects with the valid room-scoped recovery credential within 15 seconds
- **THEN** the server restores that player's seat, selected boxer, and current match state

#### Scenario: Reconnect grace period expires
- **WHEN** the player does not reconnect within 15 seconds
- **THEN** the connected opponent wins by forfeit and receives a clear result

### Requirement: The game provides usable controls and recovery states
The game SHALL explain its keyboard and gamepad controls, provide touch controls on narrow screens, safely release input after focus loss or pointer cancellation, and expose loading, connection, full-room, retry, rematch, and initialization-error states.

#### Scenario: Focus or pointer is lost
- **WHEN** the tab loses focus or a touch/pointer control is cancelled
- **THEN** the client sends neutral input and does not leave an attack or defense control stuck

#### Scenario: WebGPU initialization fails
- **WHEN** the browser lacks WebGPU or engine initialization fails
- **THEN** the app shows an actionable error instead of a blank play area

### Requirement: Presentation uses original 16-bit artwork
The game SHALL use original 16-bit pixel-art boxers, ring, UI, effects, and audio. It SHALL NOT use extracted ROM data, copied sprites, logos, music, or sound effects from the referenced game.

#### Scenario: Render the match on desktop and mobile
- **WHEN** the game is opened on a desktop or narrow mobile viewport
- **THEN** the full fixed-landscape client view, essential HUD, and controls remain usable without stretching the playfield

### Requirement: Game sound is controllable
The game SHALL provide six original event-driven sound effects, a visible mute control, and a `?mute=1` URL option that mutes all game sound. It SHALL NOT play music.

#### Scenario: Player mutes game sound
- **WHEN** a player activates the mute control
- **THEN** all event sounds stop until the player unmutes them

#### Scenario: Silent browser testing
- **WHEN** the game is opened with the `mute=1` query parameter
- **THEN** all game sound stays muted without user interaction
