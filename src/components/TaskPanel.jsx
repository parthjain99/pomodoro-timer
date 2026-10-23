import { useState } from 'react';
import { CheckIcon, PlusIcon } from './Icons.jsx';

export default function TaskPanel({ tasks, setTasks, selectedId, setSelectedId, projects, running }) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState('');
  const [est, setEst] = useState(1);
  const [projectId, setProjectId] = useState('');

  function addTask(e) {
    e.preventDefault();
    const name = text.trim();
    if (!name) return;
    const task = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      text: name,
      est: Math.min(20, Math.max(1, Number(est) || 1)),
      pomos: 0,
      done: false,
      projectId: projectId || null,
    };
    setTasks((prev) => [...prev, task]);
    if (!selectedId) setSelectedId(task.id);
    setText('');
    setEst(1);
    setProjectId('');
    setAdding(false);
  }

  function removeTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedId === id) {
      const rest = tasks.filter((t) => t.id !== id);
      setSelectedId(rest[0]?.id || null);
    }
  }

  // Marking the current task as done moves "Working on" to the next unfinished task.
  function toggleDone(id) {
    const target = tasks.find((t) => t.id === id);
    const finishing = target && !target.done && id === selectedId;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    if (finishing) {
      const idx = tasks.findIndex((t) => t.id === id);
      const next = tasks.slice(idx + 1).find((t) => !t.done) || tasks.find((t) => !t.done && t.id !== id);
      setSelectedId(next ? next.id : null);
    }
  }

  // Swap a task with its neighbour. dir is -1 (up) or 1 (down).
  function moveTask(id, dir) {
    setTasks((prev) => {
      const i = prev.findIndex((t) => t.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  function setTaskProject(id, value) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, projectId: value || null } : t)));
  }

  return (
    <section className="card task-card">
      <div className="card-header static">
        <span className="card-title">Task List</span>
      </div>

      {adding ? (
        <form className="task-add" onSubmit={addTask}>
          <input
            type="text"
            autoFocus
            placeholder="What are you working on?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <label className="est">
            Pomodoros
            <input type="number" min={1} max={20} value={est} onChange={(e) => setEst(e.target.value)} />
          </label>
          <label className="est">
            Project
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              <option value="">None</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="primary">Add</button>
          <button type="button" onClick={() => setAdding(false)}>Cancel</button>
        </form>
      ) : (
        <button className="add-task" onClick={() => setAdding(true)}>
          <PlusIcon /> Add a new task
        </button>
      )}

      <ul className="task-list scroll-list">
        {tasks.map((task, index) => (
          <li
            key={task.id}
            className={`${task.id === selectedId ? 'selected' : ''} ${task.id === selectedId && running ? 'working' : ''} ${task.done ? 'done' : ''}`}
          >
            <button
              className={`check ${task.done ? 'on' : ''}`}
              onClick={() => toggleDone(task.id)}
              aria-label={task.done ? 'Mark not done' : 'Mark done'}
            >
              {task.done && <CheckIcon />}
            </button>
            <span className="label" title="Make this the task you are working on" onClick={() => setSelectedId(task.id)}>
              {task.text}
            </span>
            {task.id === selectedId && (
              <span className={`now-badge ${running ? 'live' : ''}`}>{running ? 'Working' : 'Current'}</span>
            )}
            <select
              className="project-select"
              value={task.projectId || ''}
              onChange={(e) => setTaskProject(task.id, e.target.value)}
              aria-label="Project"
            >
              <option value="">No project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <span className="count">
              {task.pomos}/{task.est}
            </span>
            <button
              className="small ghost"
              title="Move up"
              aria-label="Move up"
              onClick={() => moveTask(task.id, -1)}
              disabled={index === 0}
            >
              ↑
            </button>
            <button
              className="small ghost"
              title="Move down"
              aria-label="Move down"
              onClick={() => moveTask(task.id, 1)}
              disabled={index === tasks.length - 1}
            >
              ↓
            </button>
            <button className="small ghost" title="Delete task" onClick={() => removeTask(task.id)}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
