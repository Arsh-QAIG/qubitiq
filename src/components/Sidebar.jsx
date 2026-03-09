'use client';

import { useState } from 'react';
import {
  Search, Monitor, Plus, Inbox, Compass,
  LayoutGrid, Zap, MoreHorizontal,
  Sparkles, Settings, User, PanelLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Search,  label: 'Search' },
  { icon: Monitor, label: 'Computer' },
];

const menuItems = [
  { icon: Plus,            label: 'New Thread' },
  { icon: Inbox,           label: 'Inbox',   badge: '3' },
  { icon: Compass,         label: 'Discover' },
  { icon: LayoutGrid,      label: 'Spaces' },
  { icon: Zap,             label: 'Dynamic', badgeLabel: 'New' },
  { icon: MoreHorizontal,  label: 'More' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const [activeNav,  setActiveNav]  = useState('Search');
  const [activeMenu, setActiveMenu] = useState('');

  return (
    <aside
      style={{ width: collapsed ? 60 : 240, transition: 'width 0.25s ease' }}
      className="h-screen flex flex-col border-r border-gray-100 bg-white shrink-0 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 border-b border-gray-100" style={{ minHeight: 56 }}>
        <button
          onClick={onToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <PanelLeft size={16} />
        </button>

        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: 'linear-gradient(135deg,#3b5bdb,#6366f1)' }}
            >
              <Sparkles size={14} className="text-white" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-semibold text-gray-900 tracking-tight">Qubit IQ</span>
              <span className="text-xs text-gray-400">AI Assistant</span>
            </div>
          </div>
        )}
      </div>

      {/* Primary nav */}
      <div className="flex flex-col gap-0.5 px-2 pt-3 pb-1">
        {navItems.map(({ icon: Icon, label }) => {
          const active = activeNav === label;
          return (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              title={collapsed ? label : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors text-left',
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              )}
            >
              <Icon
                size={16}
                strokeWidth={active ? 2.2 : 1.8}
                className={cn('shrink-0', active ? 'text-indigo-600' : '')}
              />
              {!collapsed && label}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mx-3 my-2 h-px bg-gray-100" />

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2">
        {menuItems.map(({ icon: Icon, label, badge, badgeLabel }) => {
          const active = activeMenu === label;
          return (
            <button
              key={label}
              onClick={() => setActiveMenu(label)}
              title={collapsed ? label : undefined}
              className={cn(
                'relative w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors text-left',
                active
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              )}
            >
              <Icon size={16} strokeWidth={1.8} className="shrink-0" />

              {!collapsed && (
                <>
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-600">
                      {badge}
                    </span>
                  )}
                  {badgeLabel && (
                    <span className="inline-flex items-center justify-center h-5 px-1.5 rounded-md text-xs font-semibold border border-indigo-300 text-indigo-500">
                      {badgeLabel}
                    </span>
                  )}
                </>
              )}

              {collapsed && badge && (
                <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="flex items-center gap-1 px-2 py-3 border-t border-gray-100">
        <button
          title="Settings"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Settings size={16} />
        </button>
        <button
          title="Profile"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <User size={16} />
        </button>
      </div>
    </aside>
  );
}