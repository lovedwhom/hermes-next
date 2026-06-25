'use client';

import { useState, createContext, useContext, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, Users, Film, FolderOpen, Image, ChevronRight } from 'lucide-react';

type HomeTab = 'script' | 'characters' | 'videos';

/* ── Context ────────────────────────────────────────── */

const HomeTabContext = createContext<{
  activeTab: HomeTab;
  setActiveTab: (tab: HomeTab) => void;
} | null>(null);

export function useHomeTab() {
  const ctx = useContext(HomeTabContext);
  if (!ctx) throw new Error('useHomeTab must be used within HomeTabProvider');
  return ctx;
}

function HomeTabProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<HomeTab>('script');
  return (
    <HomeTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </HomeTabContext.Provider>
  );
}

/* ── Navigation Items ───────────────────────────────── */

const navItems = [
  { id: 'script' as const, label: '剧本', icon: FileText, kind: 'tab' as const },
  { id: 'characters' as const, label: '角色', icon: Users, kind: 'tab' as const },
  { id: 'videos' as const, label: '视频', icon: Film, kind: 'tab' as const },
  { id: 'assets' as const, label: '素材', icon: FolderOpen, kind: 'link' as const, href: '/assets' },
  { id: 'uploaded-images' as const, label: '图片上传', icon: Image, kind: 'link' as const, href: '/uploaded-images' },
];

/* ── Sidebar ────────────────────────────────────────── */

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeTab, setActiveTab } = useHomeTab();
  const isHome = pathname === '/';

  const handleTabClick = (tabId: HomeTab) => {
    setActiveTab(tabId);
    if (!isHome) {
      router.push('/');
    }
  };

  return (
    <aside className="w-56 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col backdrop-blur-sm">
      {/* Logo */}
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/" className="block group">
          <h1 className="text-lg font-bold tracking-tight group-hover:opacity-80 transition-opacity">
            Hermes Studio
          </h1>
          <p className="text-xs text-zinc-400 mt-1">视频创作工作台</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.kind === 'tab'
              ? isHome && activeTab === item.id
              : pathname === item.href;
          const Icon = item.icon;

          const classes = [
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
            isActive
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black shadow-md'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:shadow-sm',
          ].join(' ');

          if (item.kind === 'link') {
            return (
              <Link key={item.id} href={item.href} className={classes}>
                <Icon className="w-4 h-4" />
                {item.label}
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />
                )}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={classes}
            >
              <Icon className="w-4 h-4" />
              {item.label}
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-xs text-zinc-400">Next.js 16 · Tailwind v4</p>
      </div>
    </aside>
  );
}

/* ── App Shell (layout wrapper) ─────────────────────── */

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <HomeTabProvider>
      <div className="flex min-h-screen bg-white dark:bg-black">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </HomeTabProvider>
  );
}
