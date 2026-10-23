const { contextBridge, ipcRenderer } = require('electron');

// Subscribe to a channel; returns a function that unsubscribes.
function on(channel, callback) {
  const handler = (_event, data) => callback(data);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
}

// Small, explicit surface for the renderer. Nothing else from Node is exposed.
contextBridge.exposeInMainWorld('pomodoro', {
  // Notifications are shown by the main process; Notification is not available in the sandboxed preload.
  notify(title, body) {
    ipcRenderer.send('notify', { title, body });
  },

  // Mini (picture-in-picture) timer window
  toggleMini() {
    ipcRenderer.send('pip:toggle');
  },
  onPipClosed(callback) {
    return on('pip:closed', callback);
  },
  sendState(state) {
    ipcRenderer.send('timer:state', state);
  },
  onState(callback) {
    return on('timer:update', callback);
  },
  requestState() {
    ipcRenderer.send('timer:request');
  },
  onResend(callback) {
    return on('timer:resend', callback);
  },
  sendCommand(command) {
    ipcRenderer.send('timer:command', command);
  },
  onCommand(callback) {
    return on('timer:command', callback);
  },
});
