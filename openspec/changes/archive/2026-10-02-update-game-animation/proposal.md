# Proposal

## Why

The two fighters currently share nearly the same center position and use only a few static poses, so punches, guards, and evasions are difficult to read during a match. Players need clear, synchronized visual cues that let them recognize an opponent's attack and choose a response.

## What Changes

- Animate both boxers from the existing authoritative action and action-frame state.
- Keep each boxer at its established horizontal anchor; use brief punch leans, defensive sways, ducks, hit reactions, and recovery poses that return to idle.
- Give head and body attacks distinct windups and impact poses, with readable high/low guards and evasions for both the local rear view and remote front view.
- Preserve server ownership of combat timing and outcomes; do not add roaming movement, alter attack reach, or change match rules.
- Use original pixel-art animation frames and preserve the existing boxer designs, relative sizes, and client-specific perspectives.

## Capabilities

### New Capabilities

- `boxer-animation`: Readable original action animations for both boxers, synchronized to authoritative combat state while keeping their horizontal positions anchored.

### Modified Capabilities

None.

## Impact

The Babylon Lite content renderer, boxer atlas and its generator, client-side action timeline/presentation, focused client tests, and rendering documentation are affected. The server protocol already supplies the action and action-frame data needed, so no multiplayer message or server simulation change is expected.
