# Tasks

## 1. Original boxer animation assets and timeline

- [x] 1.1 Extend the deterministic generator with original front/rear pixel-art cels for idle, head/body punches, high/low guard, evasion, block, and hit-stun; verify generated atlas dimensions, clip coverage, and pixel-art constraints with focused asset tests.
- [x] 1.2 Add a pure action/action-frame-to-clip mapper, including the locally predicted start and transition to authoritative progress; verify every server action maps to the intended target/pose and transitions through windup, impact, recovery, and idle in unit tests.

## 2. Render synchronized action animation

- [x] 2.1 Animate both fighters from the clip mapper while preserving local-rear/opponent-front mapping, relative sizes, and stable horizontal anchors; verify both seat mappings, target-specific attack cues, and temporary pose offsets in focused renderer tests.
- [x] 2.2 Ensure interrupted, rejected, and completed actions settle without visual drift and remote cels follow interpolated action progress; verify return-to-anchor and correction behavior across action transitions in motion/render tests.

## 3. Integration and delivery evidence

- [x] 3.1 Update the rendering documentation and README screenshot to show the current animated presentation; verify the screenshot is generated from the current game build and the documented rendering description matches the implementation.
- [x] 3.2 Run `npm test` and `npm run build`; then verify with two independent browser clients that head/body punches, guards, evasions, and hit reactions are readable from both perspectives and that each boxer returns to its anchor after the action.
- [x] 3.3 Run strict OpenSpec validation and inspect the final scoped diff; verify the change modifies only the game repository and introduces no server protocol, match-rule, or new-input changes.
