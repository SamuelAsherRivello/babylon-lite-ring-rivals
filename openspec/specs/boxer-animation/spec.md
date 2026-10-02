# Boxer Animation

## Purpose

Defines readable original boxer animation for online matches, synchronized to the shared combat timeline while preserving each client's fixed Punch-Out-style perspective.

## Requirements

### Requirement: Both boxers animate from the shared combat timeline
The client SHALL render distinct original animation for idle stance, head and body punches, high and low guard, evasions, and hit reactions for both fighters. Remote animation SHALL follow authoritative action state and progress. Local animation MAY begin immediately from player input, then SHALL reconcile to authoritative state without changing combat outcomes.

#### Scenario: Opponent telegraphs a punch
- **WHEN** the opponent begins a head or body punch
- **THEN** its front-facing animation clearly identifies the attack target before the server resolves the hit

#### Scenario: Local boxer acts before a snapshot arrives
- **WHEN** the local player starts a punch, guard, or evasion between snapshots
- **THEN** the rear-facing boxer begins the matching animation immediately and transitions to the authoritative action timeline when its snapshot arrives

#### Scenario: Guard and hit reactions are synchronized
- **WHEN** either boxer guards, evades, blocks, or is hit
- **THEN** both clients show the corresponding distinct defensive or reaction animation for that boxer

### Requirement: Action motion returns to each boxer's fixed horizontal anchor
Action animations SHALL use temporary pose changes and side sway or ducking around each boxer's established horizontal position. When an action ends, is cancelled, or recovers, the animation SHALL return the boxer to its neutral pose and anchor without accumulated visual offset or drift.

#### Scenario: Boxer completes a punch or defensive move
- **WHEN** the authoritative action reaches recovery or returns to idle
- **THEN** the boxer visibly settles back to its original horizontal anchor and neutral pose

#### Scenario: Both fighters animate in the same exchange
- **WHEN** both players act during a shared match interval
- **THEN** each client animates both boxers independently while keeping its own boxer smaller in the foreground from behind and the opponent larger and facing it

### Requirement: Animation does not change server-owned fight rules
Animation timing and pose SHALL be presentation only. The server SHALL remain authoritative for attack timing, defense, hit resolution, stamina, health, and match outcomes, and animation SHALL NOT add persistent footwork or change attack reach.

#### Scenario: Animation is corrected by authoritative state
- **WHEN** a predicted local animation disagrees with a received combat state
- **THEN** the display reconciles to the server state without changing the server's result
