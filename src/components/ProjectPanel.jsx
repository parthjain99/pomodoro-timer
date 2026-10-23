import { useState } from 'react';
import { formatMinutes, sumMinutes } from '../lib/analytics.js';
import { FolderIcon, PlusIcon } from './Icons.jsx';

export const PROJECT_COLORS = ['#ff6b81', '#4f3bd6', '#2e8b57', '#f0a202', '#0d9bd6', '#8e44ad'];

export default function ProjectPanel({ projects, setProjects, sessions, onDelete }) {
  const [name, setName] = useState('');

  function addProject(e) {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) return;
    const project = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      name: clean,
      color: PROJECT_COLORS[projects.length % PROJECT_COLORS.length],
    };
    setProjects((prev) => [...prev, project]);
    setName('');
  }

  return (
    <section className="card project-card">
      <div className="card-header static">
        <span className="card-title">
          <FolderIcon /> Projects
        </span>
      </div>

      <form className="row-form project-add" onSubmit={addProject}>
        <input
          type="text"
          placeholder="New project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">
          <PlusIcon /> Add
        </button>
      </form>

      <ul className="task-list scroll-list">
        {projects.length === 0 && <li className="hint">Create a project, then assign tasks to it.</li>}
        {projects.map((p) => {
          const total = sumMinutes(
            sessions.filter((s) => s.projectId === p.id),
            0,
            Infinity
          );
          return (
            <li key={p.id}>
              <span className="dot" style={{ background: p.color }} />
              <span className="label">{p.name}</span>
              <span className="count">{formatMinutes(total)} tracked</span>
              <button className="small ghost" title="Delete project" onClick={() => onDelete(p.id)}>
                ×
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
