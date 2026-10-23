# Competitor feature-gap report

This report compares Pomodoro against popular Pomodoro and focus apps, and suggests what to build next.

**How to read the table:** *Yes* means the feature is present, *No* means absent, *Paid* means only on a paid plan,
and *Unverified* means the claim came from marketing or a third-party listing and was not checked in the app itself.
Vendor claims are marketing, and prices change often. Check each app before relying on a number here.

## 1. Summary

Pomodoro is strongest where competitors are weakest: a free, no-account timer with tasks, projects, and a YouTube
player that follows the timer in both directions. Its biggest gaps are the things users expect from a modern focus app:
automatic next-phase starts, sound options, mobile and offline access, sync across devices, and a richer task manager.

Top five gaps, by likely user impact:
1. **Auto-start the next phase** (most competitors offer it, and it removes a click every 25 minutes).
2. **Ticking sound and alarm choices** (with volume control).
3. **Mobile and offline access** (no PWA, no install, no offline mode).
4. **Dark mode and themes** (no theming at all).
5. **Task editing and safety** (no edit after create, no undo or confirm on delete, no clear-finished).

## 2. Comparison table

| Feature | Pomodoro (ours) | Pomofocus | Pomodoro Flow | Focus To-Do | TickTick | Forest | Session / Flow | Toggl Track | Focusmate |
|---|---|---|---|---|---|---|---|---|---|
| Free to use | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (1 user) | Yes (3 sessions/week) |
| No account needed | Yes | Yes | Yes | No | No | No | No | No | No |
| Custom focus/break lengths | Yes | Yes | Yes | Yes | Yes | Yes (10–120 min) | Yes | Yes | No (fixed 25/50) |
| Long break every N sessions | Yes | Unverified | Unverified | Unverified | Unverified | No | Unverified | No | No |
| Auto-start next phase | No | Unverified | Unverified | Unverified | Unverified | No | Unverified | No | No |
| Ticking sound | No | Unverified | Yes (mute option) | Unverified | Unverified | No | No | No | No |
| Choice of alarm sounds | No | Yes | Yes | Unverified | Unverified | No | Unverified | No | No |
| Background / white noise | Via YouTube only | Yes | Yes (YouTube) | Yes | Yes | No | No | No | No |
| Playlists | No | No | Paid | No | No | No | No | No | No |
| Built-in task list | Yes | Yes | Yes | Yes | Yes | Yes | No | Yes | No |
| Task estimates (pomodoros) | Yes | Yes | No | Yes | Unverified | No | No | No | No |
| Projects | Yes | Paid | No | Yes | Yes | No | No | Yes | No |
| Subtasks | No | No | No | Yes | Yes | No | No | Unverified | No |
| Due dates / reminders | No | No | No | Yes | Yes | No | No | No | No |
| Recurring tasks | No | No | No | Yes | Yes | No | No | No | No |
| Task templates | No | Yes (3 free) | No | Unverified | Unverified | No | No | No | No |
| Drag to reorder tasks | Yes (drag only) | Unverified | No | Unverified | Unverified | No | No | No | No |
| Stats / reports | Desktop only | Yes | Basic | Yes | Yes | Yes | Yes | Yes | No |
| CSV export | Desktop only | Paid | No | Paid | Unverified | No | Yes | Yes | No |
| Web analytics | No | Yes | No | Yes | Yes | No | No | Yes | No |
| Sync across devices | No | Unverified | No | Yes | Yes | Yes | Yes (iCloud) | Yes | Yes |
| Mobile app | No | No | Yes | Yes | Yes | Yes | Yes (iOS) | Yes | No |
| Desktop app | Yes (Win, Mac, Linux) | Yes | No | Yes | Yes | No | Yes (Mac) | Yes | No |
| Web app | Yes | Yes | Yes | Yes | Yes | No | No | Yes | Yes |
| Offline mode / PWA | No | No | No | Yes | Yes | Yes | Yes | Unverified | No |
| Dark mode / themes | No | Unverified | Unverified | Unverified | Unverified | No | Unverified | Unverified | No |
| Website / app blocking | No | No | No | No | No | Yes (phone) | Yes | No | No |
| Gamification | No | No | No | No | No | Yes (tree) | No | No | No |
| Calendar integration | No | No | No | Yes | Yes | No | Yes (Apple) | Yes | No |
| Third-party integrations | No | Yes (Todoist, Zapier) | No | Unverified | Yes | No | Yes (Apple) | Yes (100+) | No |
| Live accountability partner | No | No | No | No | No | No | No | No | Yes |
| Timer synced to music | Yes (both ways) | No | No | No | No | No | No | No | No |
| Mini always-on-top timer | Desktop only | No | No | No | No | No | Yes (menu bar) | No | No |

## 3. Gaps by area

**Timer and sound**
- Auto-start the next phase or next focus session (we always wait for a click).
- Ticking sound with its own volume, and a choice of alarm sounds.
- Alarm volume and repeat, and sound previews.
- Timer fullscreen mode, and a tray or menu-bar timer.
- Web browser notifications (we only notify on desktop).

**Tasks**
- Edit a task after creating it (text and estimate).
- Subtasks, due dates, reminders, recurring tasks, notes, and priorities.
- Task templates for repetitive work.
- Undo or confirmation on delete, and clear-finished.
- Search and filters.
- Keyboard and touch alternatives for drag-to-reorder.

**Stats and export**
- Analytics on the web (sessions are recorded there, but nothing is shown).
- Streaks, goals, daily targets, and heatmaps.
- Custom date ranges and period navigation.
- JSON backup and restore of all data.

**Sync and storage**
- Accounts and sync across devices. Our data stays on one device by design.
- Export and import of data, and cookie-size warnings on the web.

**Platforms and mobile**
- Mobile app, or at least a PWA with install and offline support.
- Dark mode and themes.
- Languages other than English.
- Intel Mac build, code signing, and auto-update.

**Integrations**
- Calendar integration, Todoist or Trello sync, and webhooks.

**Motivation and social**
- Gamification, such as a growing tree or streaks with rewards.
- Live accountability partners.

**Blocking**
- Website and app blocking during focus sessions.

## 4. Small details and micro-interactions

| Detail | Ours | Competitors seen | Status |
|---|---|---|---|
| Drag to reorder tasks | Yes (mouse drag only) | Not verified in apps | Competitors unverified |
| Edit a task inline | No | Not verified | Unverified |
| Undo or confirm on delete | No | Not verified | Unverified |
| Clear finished tasks | No | Not verified | Unverified |
| Auto-start toggles | No | Listed in app-store copy (Pomodoro — Focus & Tasks, Time Tango) | Listing claim only |
| Ticking sound with volume | No | Listed in app-store copy (Time Tango) | Listing claim only |
| Alarm sound picker and volume | Alarm on/off only | Pomofocus and Pomodoro Flow list alarm sounds | Pomofocus and Flow confirmed in fetched text |
| Themes / dark mode | No | Listed in app-store copy (6 color themes, 20 backgrounds, shape styles) | Listing claim only |
| Timer fullscreen | No | Not verified | Unverified |
| Tab title shows time | Yes | Not verified | Ours verified in code |
| Notification shows time left | No (only "Focus done") | Listed in app-store copy (ongoing notifications) | Listing claim only |
| Per-task pomodoro count | Yes | Listed (Focus To-Do, Pomodoro — Focus & Tasks) | Confirmed by listing |
| Estimated finish time for today | No | Pomofocus | Confirmed in Pomofocus page |
| In-app tour / onboarding | No | Pomodoro Flow | Confirmed in Pomodoro Flow page |
| Keyboard shortcuts | Yes (Space, R, S, P) | Pomofocus (keyboard shortcuts listed) | Confirmed |
| Celebratory finish feedback | No (only a beep) | Not verified | Unverified |

## 5. Where we are ahead

- **Timer-synced YouTube, both ways:** pressing play in the video starts the timer, and the timer plays and pauses the video. No competitor in this list does this.
- **Mini always-on-top timer** on desktop, with controls.
- **No account, no ads, free, and private by default.**
- **Keyboard-first flow** with clear shortcuts.

## 6. Prioritized roadmap

Scores: *value* is how much users would notice; *effort* is S (days), M (about a week), or L (weeks or more).

**Build next**
1. **Auto-start next phase (toggle).** Value high, effort S. Small change in `src/lib/timer.js`; add a settings checkbox.
2. **Ticking sound with volume, and alarm choices.** Value high, effort S–M. Web Audio, as the alarm already uses.
3. **Dark mode.** Value high, effort M. CSS custom properties already exist in `styles.css`; add a theme switch.
4. **Edit task and confirm on delete.** Value medium, effort S. Small TaskPanel change, and it prevents data loss.
5. **Analytics on the web.** Value medium, effort M. Session data already exists in web cookies; the panel is currently desktop-only.

**Later**
6. **PWA: installable, offline.** Value high, effort M–L. Adds a manifest and service worker; unlocks mobile use without an app store.
7. **Notification with time left and a web notification.** Value medium, effort M.
8. **Templates for repetitive tasks.** Value medium, effort M.
9. **JSON backup and restore.** Value medium, effort S–M. Helps the local-only model.
10. **Calendar export (ICS).** Value medium, effort M. Fits without accounts.

**Skip or revisit**
- **Cloud sync and accounts.** Conflicts with the no-account, private design. Revisit only if users ask strongly.
- **Gamification (tree).** Forest's core idea; it adds noise to a simple timer. Skip.
- **Blocking.** Needs OS-level permissions and reviews on app stores. Skip for now.
- **Team and billing features.** A different product (Toggl). Skip.

## 7. Issues found in our own app

While reviewing the code, these were found. None are features, but they should be fixed:
- The footer feature list says users can "choose which panels show on screen." That setting was removed, so the claim is false.
- `syncVideo` and `defaultVideo` exist in settings, but `syncVideo` is not wired to anything, and `defaultVideo` has no settings UI. The `onToggleSync` prop is never passed.
- A comment in `main.js` mentions a coffee button that no longer exists.
- On the web, sessions are recorded but cannot be seen, and nothing tells the user that.

## 8. Sources

- Pomofocus: https://pomofocus.io/ (features page fetched this session)
- Pomodoro Flow: https://pomodoro-flow.com/ and https://pomodoro-flow.com/app
- Comparison pages: https://goalsandprogress.com/pomodoro-apps-comparison/ and https://www.timechamp.io/blogs/best-pomodoro-apps
- Focus To-Do: https://apps.microsoft.com/detail/9n8gpb2tk8gb?hl=en-US and https://alternativeto.net/software/focus-to-do-pomodoro-techniqueand-task/about
- Pomodoro — Focus & Tasks: https://mwm.ai/apps/pomodoro-focus-tasks/6758891426
- Time Tango and Pomodoro Timer listings: https://apps.apple.com/us/app/-/id6451069614

Not verified in the apps themselves: items marked *Unverified* or *Listing claim only*. Before publishing externally, check them in each app.
