<p align="center">
  <img src="build/icon.png" width="160" alt="Pomodoro logo" />
</p>

# Pomodoro

A desktop Pomodoro timer with tasks, projects, analytics, and an optional YouTube player that follows the timer.

## Demo

https://github.com/parthjain99/pomodoro-timer/raw/main/brag-output/brag.mp4

<video src="brag-output/brag.mp4" controls width="720"></video>

## Download

Get the installer for your system from the [v0.1.0 release](https://github.com/parthjain99/pomodoro-timer/releases/tag/v0.1.0).

| System | File | How to install |
| --- | --- | --- |
| macOS (Apple Silicon, M1 or later) | `Pomodoro-0.1.0-arm64.dmg` | Open the DMG and drag **Pomodoro** into Applications. The first time, right-click the app and choose **Open**. |
| macOS (Intel) | `Pomodoro-0.1.0.dmg` | Same as above. |
| Windows (64-bit) | `Pomodoro Setup 0.1.0.exe` | Run the installer. If SmartScreen warns, click **More info → Run anyway**. |
| Linux (AppImage) | `Pomodoro-0.1.0.AppImage` | `chmod +x Pomodoro-0.1.0.AppImage`, then double-click it or run `./Pomodoro-0.1.0.AppImage`. |

The installers are not code-signed, so each system shows a one-time security warning.

## Features

- **Timer:** focus and break cycles, with customizable durations, an alarm at the end of each phase, and a mini always-on-top window.
- **Tasks:** estimated pomodoros, a "working on" picker, and per-task project assignment.
- **Projects:** group tasks into projects and see the time tracked for each.
- **Analytics:** focus time and session counts by day, week, month, or year, with a per-project breakdown and CSV export.
- **YouTube:** play focus music, with playback that follows the timer. Pressing play in the player starts the timer, and pausing the player pauses it. Saved and recently played videos are kept in a list.

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

Output goes to `release/`. Build each platform's installer on that platform, or use the GitHub Actions workflow in `.github/workflows/build.yml`. It builds all of them on their own systems. Run it from the Actions tab, or push a tag such as `v0.1.0`.

For development, `npm start` builds the app and opens it.

## Notes

- Videos need an internet connection. The timer and tasks work offline.
- Your data is saved on each computer separately.
