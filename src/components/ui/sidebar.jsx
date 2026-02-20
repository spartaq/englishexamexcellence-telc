// src/components/ui/Sidebar.jsx
import { LayoutDashboard, BookOpen, Mic2, Settings, Award } from 'lucide-react';
import useExamStore from '../../store/useExamStore';

export default function Sidebar() {
  const { currentView, setView } = useExamStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'hub', label: 'Skill Hub', icon: <BookOpen size={20} /> },
    { id: 'practice', label: 'Practice Sets', icon: <Award size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="desktop-sidebar">
      <div className="brand-area">
        <h2 style={{ color: 'var(--success-mint)', fontWeight: 800 }}>EXAM LAB</h2>
        <span style={{ fontSize: '10px', opacity: 0.6 }}>VERSION 1.0</span>
      </div>

      <nav className="side-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`nav-btn ${currentView === item.id ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {/* User Progress Mini-Card */}
        <div className="xp-mini-card">
          <p className="task-label">Current Rank</p>
          <p className="xp-text">Academic Scholar</p>
        </div>
      </div>
    </aside>
  );
}