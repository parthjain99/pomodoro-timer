# Pomodoro — install

Download the file for your system from the `release/` folder (or from the GitHub Actions artifacts).

| System | File | How to install |
| --- | --- | --- |
| macOS (Apple Silicon, M1 or later) | `Pomodoro-0.1.0-arm64.dmg` | Open the DMG and drag **Pomodoro** into Applications. The first time, right-click the app and choose **Open** (the app is not signed). |
| macOS (Intel) | `Pomodoro-0.1.0.dmg` | Same as above. |
| Windows (64-bit) | `Pomodoro Setup 0.1.0.exe` | Run the installer. If SmartScreen warns, click **More info → Run anyway** (the app is not signed). |
| Linux (AppImage) | `Pomodoro-0.1.0.AppImage` | `chmod +x Pomodoro-0.1.0.AppImage` then double-click it or run `./Pomodoro-0.1.0.AppImage`. |
| Linux (Debian/Ubuntu) | `pomodoro-desktop_0.1.0_amd64.deb` | `sudo apt install ./pomodoro-desktop_0.1.0_amd64.deb` |

## Building the installers yourself

```
npm install
npm run dist
```

Output goes to `release/`. Building only works fully on the matching system:
- macOS builds the `.dmg` for Apple Silicon and Intel (`npx electron-builder --mac dmg --x64`).
- Windows builds the `.exe`.
- Linux builds the `.AppImage` and `.deb`.

The GitHub Actions workflow in `.github/workflows/build.yml` builds all of them on their own systems. Run it from the Actions tab, or push a tag such as `v0.1.0`.

## Notes

- The app uses the YouTube player, so it needs an internet connection for videos. The timer and tasks work offline.
- Installers are not code-signed, so each OS shows a one-time security warning.
- Your tasks, projects, and analytics are saved on each computer separately.
