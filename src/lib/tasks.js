// Puts unfinished tasks first and finished tasks last, keeping the order within each group.
export function sortDoneToBottom(list) {
  return [...list.filter((t) => !t.done), ...list.filter((t) => t.done)];
}
