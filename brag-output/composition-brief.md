# Hyperframes Composition Brief: Pomodoro

## Objective
Create a short launch-style brag video for Pomodoro, a desktop Pomodoro timer.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape - 1920x1080
- Duration: 22 seconds

## Source Material
- Project root: /Users/parthjain/Desktop/project/pomodoro
- Primary files read: README.md, src/App.jsx, src/components/VideoPanel.jsx, src/components/TaskPanel.jsx, src/styles.css, src/assets/logo.png
- Product name: Pomodoro
- Tagline / strongest claim: "The player follows the timer."
- Key UI moment to recreate: the timer card (tabs, big monospace clock, "Working on" picker), the task list with "Working" badge, the Focus Music card with a play overlay
- Copy that must appear verbatim:
  - "The player follows the timer."
  - "Press play in the video. The timer starts."
  - "Every session, exported as CSV."
  - "A desktop Pomodoro timer. The player follows the timer."
  - UI labels: "Focus", "Short Break", "Long Break", "Working on", "Working", "Add a new task", "Export CSV"

## Creative Direction
- Tone preset: default
- Creative direction: playful, clean, postable
- Interpretation: short holds, fast motion, lines lifted from the app
- Angle: the app's own rule (the player follows the timer), shown by the real UI
- Hook: "The player follows the timer." (0-2.5s)
- Outro / punchline: "A desktop Pomodoro timer. The player follows the timer."
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated visual redesign

## Visual Identity
- Background: #f5f5f5 (page), #ffffff (cards)
- Text: #111111 (primary), #6b6b70 (muted)
- Accent: #ff6b81 (primary, active tab), #4f3bd6 (selected)
- Display font: system sans (bold)
- Body font: system sans
- Clock font: monospace
- Visual references: timer card, task list, Focus Music card, logo

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Hook - 2.5s - "The player follows the timer." must be readable
2. The timer - 4s - tabs and the counting clock
3. Tasks - 5s - three task rows, "Working" badge
4. Video starts the timer - 5s - play in the player, the timer starts
5. Analytics - 2s - Export CSV line
6. Outro - 2s - logo and final line, music fades

## Audio
- Audio role: warm bed
- Audio arc: bed from 0s, card sounds on the task rows, payoff at 16s, fade under the logo
- Music: happy-beats-business-moves-vol-1-by-ende-dot-app.mp3 (120 BPM, beat grid from 3.02s every 0.5s, strong cues at 16.02s and 17.02s)
- Music treatment: volume 0.35; fade out over the last 1.5s
- Music cue guidance: lock the timer-start payoff to 16.02s (within 0.15s); task rows snap to 6.52, 7.52, 8.52 (every other beat, readable)
- Audio-reactive treatment: none
- Audio-coupled moments:
  - Scene 2 - tabs pop on beats 3.02, 3.52, 4.02
  - Scene 3 - task rows on beat grid 6.52, 7.52, 8.52
  - Scene 4 - timer start on strong cue 16.02s
- SFX selection guidance: card sounds for task rows; no SFX in Scene 5
- SFX analysis guidance: use lower high-frequency-risk files
- Exact SFX choice: Hyperframes chooses filenames, timestamps, density, and volume
- Audio files: `composition/assets/music/` (copied)

## Hyperframes Instructions
Load the composition-building Hyperframes domain skills to create `brag-output/composition/`. Do not enter the generic promo workflow. Run `npx hyperframes check` before render. Render to `brag-output/brag.mp4`. Keep rendering local.

Requirements:
- Show real UI, copy, or visual elements from the project.
- Keep all text readable (each line holds at least its reading time).
- Keep the video within 15-25 seconds.
- Include the music layer as planned.
- Keep creation and rendering local.
