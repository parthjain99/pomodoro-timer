<p align="center">
  <img src="build/icon.png" width="160" alt="Pomodoro logo" />
</p>

# Pomodoro

A desktop Pomodoro timer with tasks, projects, analytics, and an optional YouTube player that follows the timer.

## Demo

https://github.com/parthjain99/pomodoro-timer/raw/main/brag-output/brag.mp4

<video src="brag-output/brag.mp4" controls width="720"></video>

## Features

A free Pomodoro timer with YouTube music and task management in one place.

- **Timer:** focus and break cycles with adjustable lengths, a clock that counts down, and a mini always-on-top window.
- **Task list:** add tasks with an estimated number of pomodoros, mark them done, and pick the one you are working on.
- **Projects:** group tasks into projects and see the time tracked for each.
- **YouTube music:** paste a link and play focus music. Pressing play starts the timer, and pausing pauses it.
- **Saved and recent videos:** star videos to keep them, and reopen recently played ones.
- **Settings:** change durations, turn the alarm on or off,.
- **Keyboard shortcuts:** start, pause, reset, skip, and open the mini timer without the mouse.
- **No sign-up:** nothing to create. Your data stays on your device.

## Download

Get the latest installer from the [latest release](https://github.com/parthjain99/pomodoro-timer/releases/latest):

- **macOS (Apple Silicon):** `Pomodoro-mac-arm64.dmg`. Open it and drag **Pomodoro** into Applications. The first time, right-click the app and choose **Open**.
- **Windows (64-bit):** `Pomodoro-windows-x64.exe`. If SmartScreen warns, click **More info → Run anyway**.
- **Linux (64-bit AppImage):** `Pomodoro-linux-x64.AppImage`. Run `chmod +x` on it, then open it.

The installers are not code-signed, so each system shows a one-time security warning.

## Web version

The same app runs in a browser. Deploy it to Vercel with the included `vercel.json`:

- Build command: `npm run build`
- Output directory: `dist`

In the browser, your tasks, projects, settings, and video list are saved in cookies on that device. The desktop app saves them in local storage instead. Clearing cookies resets the web version.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| Space | Start or pause |
| R | Reset |
| S | Skip |
| P | Open or close the mini timer |

## Build from source

```
npm install
npm run dist
```

Output goes to `release/`.

## Publishing a release

Push a version tag and GitHub builds all three installers and publishes them:

```
git tag v0.1.1
git push origin v0.1.1
```

The workflow is in `.github/workflows/release.yml`.

## Notes

- Videos need an internet connection. The timer and tasks work offline.
- Your data is saved on each computer or browser separately.
